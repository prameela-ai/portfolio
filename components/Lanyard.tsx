"use client";

// 3D ID card on a lanyard that visitors can grab and throw.
// Same technique as Vercel's Ship 2024 badge and React Bits' <Lanyard />:
// Rapier rope joints for the strap, a MeshLine for the band, and a card hung from a spherical joint.
// Unlike those, the card front is drawn in code (photo, text, QR code) instead of loaded from a .glb model.

import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { cardBack } from "@/lib/content";
import { Canvas, extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: Omit<ThreeElement<typeof MeshLineMaterial>, "args"> & {
      args?: ConstructorParameters<typeof MeshLineMaterial>;
    };
  }
}

const NAVY = "#1e2a4a";
const MUTED = "#545b6b";
const CARD_W = 1.6;
const CARD_H = 2.25;

type Textures = { front: THREE.Texture; back: THREE.Texture; band: THREE.Texture };

type LanyardProps = {
  resumeUrl: string;
  /** Becomes true when the section scrolls into view: the card then drops in. */
  drop: boolean;
  flipped: boolean;
  onFlip: () => void;
  onReady: () => void;
};

export default function Lanyard({ resumeUrl, drop, flipped, onFlip, onReady }: LanyardProps) {
  const [textures, setTextures] = useState<Textures | null>(null);

  useEffect(() => {
    let cancelled = false;
    const url = new URL(resumeUrl, window.location.origin).href;
    makeTextures(url).then((t) => {
      if (cancelled) return;
      setTextures(t);
      onReady();
    });
    return () => {
      cancelled = true;
    };
  }, [resumeUrl, onReady]);

  return (
    <Canvas camera={{ position: [0, 0, 11], fov: 25 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <ambientLight intensity={2.4} />
      {textures && drop && (
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band textures={textures} flipped={flipped} onFlip={onFlip} />
        </Physics>
      )}
      <Environment blur={0.75} resolution={256}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}

function Band({
  textures,
  flipped,
  onFlip,
  maxSpeed = 50,
  minSpeed = 10,
}: {
  textures: Textures;
  flipped: boolean;
  onFlip: () => void;
  maxSpeed?: number;
  minSpeed?: number;
}) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  // Smoothed positions of the two middle joints (reduces jitter when the card is pulled hard).
  const lerped = useRef<[THREE.Vector3 | null, THREE.Vector3 | null]>([null, null]);

  const [vec, ang, dir, facing] = useMemo(() => [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  // Where and when the pointer went down, to tell a click (flip) from a drag.
  const press = useRef<{ x: number; y: number; t: number } | null>(null);
  const { width, height } = useThree((state) => state.size);
  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
    c.curveType = "chordal";
    return c;
  }, []);
  const cardShape = useMemo(() => roundedCardGeometry(CARD_W, CARD_H, 0.12), []);

  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  const segmentProps: RigidBodyProps = { type: "dynamic", canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  // Wake the card so a flip starts even if the physics has gone to sleep.
  useEffect(() => {
    card.current?.wakeUp();
  }, [flipped]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current || !band.current) return;

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }

    [j1.current, j2.current].forEach((body, i) => {
      const pos = body.translation();
      const current = (lerped.current[i] ??= new THREE.Vector3().copy(pos));
      const clamped = Math.max(0.1, Math.min(1, current.distanceTo(pos)));
      current.lerp(pos, delta * (minSpeed + clamped * (maxSpeed - minSpeed)));
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(lerped.current[1]!);
    curve.points[2].copy(lerped.current[0]!);
    curve.points[3].copy(fixed.current.translation());
    band.current.geometry.setPoints(curve.getPoints(32));

    // Spring the card's heading towards the front (0) or, when flipped, the back (π).
    const q = card.current.rotation();
    quat.set(q.x, q.y, q.z, q.w);
    facing.set(0, 0, 1).applyQuaternion(quat);
    const heading = Math.atan2(facing.x, facing.z);
    const target = flipped ? Math.PI : 0;
    const error = Math.atan2(Math.sin(target - heading), Math.cos(target - heading));
    ang.copy(card.current.angvel());
    card.current.setAngvel({ x: ang.x, y: ang.y + error * 0.15, z: ang.z }, Math.abs(error) > 0.01);
  });

  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    if (!card.current) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    press.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    setDragged(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
  }

  function onPointerUp(e: ThreeEvent<PointerEvent>) {
    (e.target as Element).releasePointerCapture(e.pointerId);
    setDragged(false);
    const p = press.current;
    press.current = null;
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) < 6 && performance.now() - p.t < 350) onFlip();
  }

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        {/* Bodies start stacked above the anchor, so the card falls into view and bounces on the strap. */}
        <RigidBody position={[0.1, 0.4, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.2, 0.8, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.3, 1.2, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.4, 2.6, 0]} ref={card} {...segmentProps} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, 0.01]} />
          <group onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            {/* Front */}
            <mesh geometry={cardShape} position={[0, 0, 0.006]}>
              <meshBasicMaterial map={textures.front} toneMapped={false} />
            </mesh>
            {/* Back */}
            <mesh geometry={cardShape} position={[0, 0, -0.006]} rotation={[0, Math.PI, 0]}>
              <meshBasicMaterial map={textures.back} toneMapped={false} />
            </mesh>
            {/* Metal clip joining card and strap */}
            <mesh position={[0, CARD_H / 2 + 0.16, 0]}>
              <boxGeometry args={[0.16, 0.34, 0.05]} />
              <meshStandardMaterial color="#b9bec8" metalness={0.9} roughness={0.25} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={new THREE.Vector2(width, height)}
          useMap={1}
          map={textures.band}
          repeat={new THREE.Vector2(-4, 1)}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

// A flat card shape with rounded corners and UVs that map the whole texture onto it.
function roundedCardGeometry(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const geometry = new THREE.ShapeGeometry(s, 8);
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h);
  return geometry;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function canvasTexture(canvas: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 16;
  return t;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// Draws the card faces and the strap with the site's own fonts.
async function makeTextures(resumeUrl: string): Promise<Textures> {
  await document.fonts.ready;
  const root = getComputedStyle(document.documentElement);
  const sans = root.getPropertyValue("--font-inter") || "sans-serif";
  const serif = root.getPropertyValue("--font-instrument") || "serif";
  const [photo, qr] = await Promise.all([
    loadImage("/card-photo.webp"),
    QRCode.toDataURL(resumeUrl, { margin: 0, width: 240, color: { dark: NAVY, light: "#ffffff" } }).then(loadImage),
  ]);

  // Front: 1024 × 1440 keeps the card's 1.6 : 2.25 ratio.
  const W = 1024;
  const H = 1440;
  const front = document.createElement("canvas");
  front.width = W;
  front.height = H;
  const f = front.getContext("2d")!;
  f.fillStyle = "#ffffff";
  f.fillRect(0, 0, W, H);
  f.fillStyle = NAVY;
  f.fillRect(0, 0, W, 210);
  f.fillStyle = "#f5f1e8";
  roundRect(f, W / 2 - 90, 36, 180, 30, 15);
  f.fill();
  f.fillStyle = "#ffffff";
  f.textAlign = "center";
  f.textBaseline = "middle";
  f.font = `700 64px ${sans}`;
  f.letterSpacing = "18px";
  f.fillText("STUDENT ID", W / 2 + 9, 140);
  f.letterSpacing = "0px";

  const pw = 470;
  const ph = (pw * photo.height) / photo.width;
  f.save();
  roundRect(f, (W - pw) / 2, 260, pw, ph, 28);
  f.clip();
  f.drawImage(photo, (W - pw) / 2, 260, pw, ph);
  f.restore();

  let y = 260 + ph + 76;
  f.fillStyle = NAVY;
  f.font = `800 84px ${sans}`;
  f.fillText("Gogada Prameela", W / 2, y);
  y += 74;
  f.fillStyle = MUTED;
  f.font = `600 54px ${sans}`;
  f.fillText("B.Tech ECE · Class of 2027", W / 2, y);
  y += 90;
  f.fillStyle = NAVY;
  f.font = `italic 400 80px ${serif}`;
  f.fillText("Software & Embedded", W / 2, y);

  const qrSize = 180;
  const qrX = W / 2 - 250;
  const qrY = H - qrSize - 40;
  f.drawImage(qr, qrX, qrY, qrSize, qrSize);
  f.textAlign = "left";
  f.fillStyle = MUTED;
  f.font = `800 44px ${sans}`;
  f.letterSpacing = "6px";
  f.fillText("SCAN FOR", qrX + qrSize + 40, qrY + qrSize / 2 - 30);
  f.fillText("RÉSUMÉ", qrX + qrSize + 40, qrY + qrSize / 2 + 30);

  // Back: "What I do" list on navy.
  const back = document.createElement("canvas");
  back.width = W;
  back.height = H;
  const b = back.getContext("2d")!;
  b.fillStyle = NAVY;
  b.fillRect(0, 0, W, H);
  b.fillStyle = "#f5f1e8";
  roundRect(b, W / 2 - 90, 36, 180, 30, 15);
  b.fill();
  b.textBaseline = "middle";
  b.textAlign = "left";
  b.font = `800 56px ${sans}`;
  b.letterSpacing = "14px";
  b.fillText(cardBack.title.toUpperCase(), 90, 170);
  b.letterSpacing = "0px";
  cardBack.items.forEach((item, i) => {
    const iy = 300 + i * 190;
    b.fillStyle = "#f5f1e8";
    b.beginPath();
    b.arc(120, iy, 30, 0, Math.PI * 2);
    b.fill();
    b.fillStyle = NAVY;
    b.font = `800 36px ${sans}`;
    b.textAlign = "center";
    b.fillText("✓", 120, iy + 2);
    b.textAlign = "left";
    b.fillStyle = "#f5f1e8";
    b.font = `700 54px ${sans}`;
    b.fillText(item.label, 180, iy - 22);
    b.fillStyle = "rgba(245, 241, 232, 0.72)";
    b.font = `500 40px ${sans}`;
    b.fillText(item.detail, 180, iy + 38);
  });
  b.fillStyle = "#f5f1e8";
  b.font = `italic 400 110px ${serif}`;
  b.fillText("Prameela", 90, H - 110);

  // Strap: repeated name on navy.
  const strap = document.createElement("canvas");
  strap.width = 1024;
  strap.height = 128;
  const s = strap.getContext("2d")!;
  s.fillStyle = NAVY;
  s.fillRect(0, 0, 1024, 128);
  s.fillStyle = "#f5f1e8";
  s.textAlign = "center";
  s.textBaseline = "middle";
  s.font = `700 52px ${sans}`;
  s.letterSpacing = "10px";
  s.fillText("PRAMEELA  ·  ECE", 512, 66);
  const band = canvasTexture(strap);
  band.wrapS = band.wrapT = THREE.RepeatWrapping;

  return { front: canvasTexture(front), back: canvasTexture(back), band };
}

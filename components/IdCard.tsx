"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAfterLoad } from "@/lib/useAfterLoad";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { FlatIdCard } from "./FlatIdCard";

// The 3D scene is a separate download, fetched only on wide screens after the page has loaded.
const Lanyard = dynamic(() => import("./Lanyard"), { ssr: false });

export function IdCard({ qrSvg, resumeUrl }: { qrSvg: string; resumeUrl: string }) {
  const wide = useMediaQuery("(min-width: 768px)");
  const reducedMotion = usePrefersReducedMotion();
  const pageLoaded = useAfterLoad();
  const [sceneReady, setSceneReady] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // The 3D card drops in the first time the About section scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const use3D = wide && !reducedMotion && pageLoaded;
  const show3D = use3D && sceneReady;
  const toggleFlip = useCallback(() => setFlipped((f) => !f), []);
  const onSceneReady = useCallback(() => setSceneReady(true), []);

  return (
    <div ref={ref} className="relative h-full">
      {/* Flat card stays until the 3D scene is ready. */}
      <div className={show3D ? "invisible" : undefined} aria-hidden={show3D}>
        <FlatIdCard qrSvg={qrSvg} flipped={flipped} onFlip={toggleFlip} />
      </div>
      {use3D && (
        <div className="absolute inset-0" aria-hidden="true">
          <Lanyard resumeUrl={resumeUrl} drop={inView} flipped={flipped} onFlip={toggleFlip} onReady={onSceneReady} />
        </div>
      )}
      {show3D && (
        <div className="absolute inset-x-0 bottom-6 flex justify-center">
          <button
            type="button"
            onClick={toggleFlip}
            aria-pressed={flipped}
            className="min-h-10 rounded-full border border-navy/20 bg-paper/80 px-4 text-xs font-semibold tracking-wide text-navy backdrop-blur hover:border-navy"
          >
            Drag the card · click to flip {flipped ? "back" : ""}
          </button>
        </div>
      )}
    </div>
  );
}

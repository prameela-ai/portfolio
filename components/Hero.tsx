"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { introTranscript, person } from "@/lib/content";
import { useAfterLoad } from "@/lib/useAfterLoad";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";
import { Accent, ButtonLink } from "./ui";

function stopSound(video: HTMLVideoElement, setSoundOn: (on: boolean) => void) {
  video.muted = true;
  const captions = video.textTracks[0];
  if (captions) captions.mode = "hidden";
  setSoundOn(false);
}

// Restarts the intro with sound. Resolves false (leaving the clip playing muted) if the browser refuses.
async function startSound(video: HTMLVideoElement, setSoundOn: (on: boolean) => void) {
  // iOS/iPadOS: a page whose video autoplayed muted is treated as "ambient" audio, which the
  // silent switch silences. Asking for "playback" lets the intro be heard regardless.
  const audioSession = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
  if (audioSession) audioSession.type = "playback";
  // Restart from the beginning so the whole spoken intro is heard.
  video.currentTime = 0;
  video.volume = 1;
  video.muted = false;
  const captions = video.textTracks[0];
  if (captions) captions.mode = "showing";
  setSoundOn(true);
  try {
    await video.play();
    return true;
  } catch {
    stopSound(video, setSoundOn);
    void video.play().catch(() => {});
    return false;
  }
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundButtonRef = useRef<HTMLButtonElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  // The still frame paints first; the clip (same first frame) takes over after the page loads.
  const showVideo = useAfterLoad() && !reducedMotion;

  // As the visitor scrolls past the hero, the clip shrinks and fades.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  // The big background name drifts down and spreads slightly (parallax).
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  // Set once the visitor mutes the intro themselves, so it is never switched back on for them.
  const mutedByVisitor = useRef(false);

  // Browsers only allow sound after the visitor has interacted with the page. So: try to start the
  // intro with sound; if that is blocked, start it on their first click, tap or key press, as long
  // as the intro is still on screen. The speech plays once, and stops if they scroll away.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!showVideo || !video || !section) return;

    let inView = true;
    let waitingForGesture = false;
    const gestureEvents = ["pointerup", "keydown", "touchend"] as const;
    const stopWaiting = () => {
      waitingForGesture = false;
      for (const type of gestureEvents) window.removeEventListener(type, onGesture, true);
    };
    const onGesture = (event: Event) => {
      // The Sound button handles its own clicks.
      if (event.target instanceof Node && soundButtonRef.current?.contains(event.target)) return;
      if (!inView || mutedByVisitor.current) return;
      stopWaiting();
      void startSound(video, setSoundOn);
    };

    const waitForGesture = () => {
      if (mutedByVisitor.current) return;
      waitingForGesture = true;
      for (const type of gestureEvents) window.addEventListener(type, onGesture, true);
    };
    // Without any interaction yet the attempt can only fail (and would briefly pause the clip).
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) waitForGesture();
    else void startSound(video, setSoundOn).then((started) => started || waitForGesture());

    // Speech plays once: when the clip finishes, mute it and keep looping silently.
    const onEnded = () => {
      if (!video.muted) stopSound(video, setSoundOn);
      video.currentTime = 0;
      void video.play().catch(() => {});
    };
    video.addEventListener("ended", onEnded);

    // Scrolled away from the intro: silence it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (!inView && !video.muted) stopSound(video, setSoundOn);
      },
      { threshold: 0.35 },
    );
    observer.observe(section);

    return () => {
      if (waitingForGesture) stopWaiting();
      video.removeEventListener("ended", onEnded);
      observer.disconnect();
    };
  }, [showVideo]);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    if (soundOn) {
      mutedByVisitor.current = true;
      stopSound(video, setSoundOn);
    } else {
      mutedByVisitor.current = false;
      void startSound(video, setSoundOn);
    }
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col overflow-hidden px-5 pt-20 pb-8 md:px-8 md:pt-16"
    >
      {/* Huge, very light name behind the clip (decorative) */}
      <motion.p
        aria-hidden="true"
        style={reducedMotion ? undefined : { y: nameY, scale: nameScale }}
        className="pointer-events-none absolute inset-x-0 top-[22%] text-center text-[18vw] leading-none font-black tracking-tighter text-navy/[0.05] select-none md:top-[38%] md:-translate-y-1/2"
      >
        PRAMEELA
      </motion.p>

      {/* mix-blend-multiply sits on the animated wrapper itself, so the clip's white
          background blends with the page rather than with an isolated layer. */}
      <motion.div
        style={reducedMotion ? undefined : { scale, opacity }}
        className="relative mx-auto w-full max-w-[880px] mix-blend-multiply"
      >
        <div className="relative aspect-[4/5] w-full sm:aspect-video">
          {/* The still frame shows first (and is all that shows with reduced motion). */}
          <Image
            src="/intro-poster.webp"
            alt="3D animated character of Prameela smiling and waving"
            fill
            preload
            sizes="(max-width: 920px) 100vw, 880px"
            className="object-cover sm:object-contain"
          />
          {showVideo && (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover sm:object-contain"
              width={1920}
              height={1080}
              autoPlay
              muted
              playsInline
              preload="metadata"
              poster="/intro-poster.webp"
              aria-label="AI-generated video intro: Prameela's 3D character waves and introduces herself"
            >
              <source src="/intro-720.mp4" type="video/mp4" media="(max-width: 767px)" />
              <source src="/intro.webm" type="video/webm" />
              <source src="/intro.mp4" type="video/mp4" />
              <track kind="captions" src="/intro.vtt" srcLang="en" label="English" />
            </video>
          )}
        </div>
      </motion.div>

      <motion.div style={reducedMotion ? undefined : { opacity }} className="relative mx-auto w-full max-w-[880px]">
        <div className="mt-2 flex min-h-11 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm text-muted">
          {showVideo && (
            <button
              ref={soundButtonRef}
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-navy/20 bg-white/70 px-4 font-semibold text-navy hover:border-navy"
            >
              <span aria-hidden="true">{soundOn ? "🔊" : "🔈"}</span>
              {soundOn ? "Mute" : "Sound"}
            </button>
          )}
          <span className="text-xs">AI-generated intro (character and voice)</span>
        </div>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted italic">
          <span className="sr-only">Transcript: </span>“{introTranscript}”
        </p>
      </motion.div>

      <div className="relative mt-auto flex flex-col gap-6 pt-10 md:flex-row md:items-end md:justify-between">
        <h1 className="text-navy">
          <span className="mb-3 block text-xs font-semibold tracking-[0.2em] text-muted uppercase">
            {person.name} · B.Tech ECE · Class of {person.classOf}
          </span>
          <span className="block text-5xl leading-[0.95] font-bold tracking-tight md:text-7xl">
            Software &amp; <Accent>Embedded.</Accent>
          </span>
        </h1>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#work">Explore work</ButtonLink>
          <ButtonLink href={person.resume} variant="outline" download>
            Resume
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

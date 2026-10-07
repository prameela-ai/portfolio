"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cardBack, person } from "@/lib/content";

// Flat HTML version of the ID card: shown on phones, with reduced motion,
// and while the 3D card is still loading. It drops in on its strap and flips on tap.
export function FlatIdCard({
  qrSvg,
  flipped,
  onFlip,
}: {
  qrSvg: string;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ y: -160, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 120, damping: 11, mass: 0.9 }}
    >
      {/* Lanyard strap */}
      <div aria-hidden="true" className="h-16 w-6 rounded-b-sm bg-navy md:h-28" />
      <div aria-hidden="true" className="-mt-1 h-5 w-10 rounded-md border-2 border-zinc-400 bg-zinc-200" />
      <motion.div
        className="-mt-1 origin-top"
        initial={{ rotate: -10 }}
        whileInView={{ rotate: -2 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 60, damping: 4, delay: 0.15 }}
      >
        <button
          type="button"
          onClick={onFlip}
          aria-pressed={flipped}
          aria-label={flipped ? "Student ID card, back: what I do. Tap to flip" : "Student ID card. Tap to flip"}
          className="block rounded-2xl [perspective:1200px]"
        >
          <motion.div
            className="relative w-[260px] [transform-style:preserve-3d] md:w-[290px]"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
          >
            <CardFront qrSvg={qrSvg} />
            <CardBack />
          </motion.div>
        </button>
      </motion.div>
    </motion.div>
  );
}

function CardFront({ qrSvg }: { qrSvg: string }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white text-left shadow-xl ring-1 ring-navy/10 [backface-visibility:hidden]">
      <div className="bg-navy py-3 text-center text-sm font-bold tracking-[0.3em] text-paper">STUDENT ID</div>
      <div className="flex flex-col items-center px-6 pt-5 pb-6 text-center">
        <Image
          src="/card-photo.webp"
          alt={`Portrait of ${person.name}`}
          width={460}
          height={575}
          sizes="200px"
          className="h-auto w-[150px] rounded-lg md:w-[170px]"
        />
        <p className="mt-4 text-xl font-bold text-navy">{person.name}</p>
        <p className="text-sm text-muted">
          {person.degree} · Class of {person.classOf}
        </p>
        <p className="mt-1 font-serif text-xl text-navy italic">Software &amp; Embedded</p>
        <div className="mt-4 flex items-center gap-3 p-1">
          <span aria-hidden="true" className="block h-16 w-16 shrink-0" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <span className="text-xs leading-snug font-semibold tracking-widest text-muted uppercase">
            Scan for
            <br />
            résumé
          </span>
        </div>
      </div>
    </div>
  );
}

function CardBack() {
  return (
    <div className="absolute inset-0 flex flex-col rounded-2xl bg-navy p-6 text-left text-paper shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
      <p className="text-sm font-bold tracking-[0.3em]">{cardBack.title.toUpperCase()}</p>
      <ul className="mt-5 space-y-4">
        {cardBack.items.map((item) => (
          <li key={item.label} className="flex gap-3">
            <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-paper text-[11px] font-bold text-navy">
              ✓
            </span>
            <span>
              <span className="block font-semibold">{item.label}</span>
              <span className="block text-sm text-paper/70">{item.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-auto font-serif text-3xl italic">{person.firstName}</p>
    </div>
  );
}

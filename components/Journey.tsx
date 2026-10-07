"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { journey } from "@/lib/content";
import { Accent } from "./ui";

// Centre-line timeline: the line draws itself as you scroll, years sit on one side
// and cards slide in from the other, alternating. Ends with a "Next" card.
export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <ol ref={ref} className="relative">
      {/* Track + scroll-drawn line (left on phones, centre on laptops) */}
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-0.5 bg-navy/10 md:left-1/2 md:-translate-x-1/2" />
      <motion.span
        aria-hidden="true"
        style={{ scaleY: lineScale }}
        className="absolute top-0 bottom-0 left-[7px] w-0.5 origin-top bg-navy md:left-1/2 md:-translate-x-1/2"
      />

      {journey.map((item, i) => (
        <TimelineRow key={item.title} side={i % 2 === 0 ? "left" : "right"} year={<>{item.when}</>}>
          <p className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">{item.when}</p>
          <h3 className="mt-1 text-xl font-bold text-navy">{item.title}</h3>
          <p className="mt-1 text-base text-ink">{item.detail}</p>
        </TimelineRow>
      ))}

      <TimelineRow side={journey.length % 2 === 0 ? "left" : "right"} year={<Accent>Next</Accent>}>
        <p className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">What&apos;s next</p>
        <h3 className="mt-1 text-xl font-bold text-navy">Your team?</h3>
        <p className="mt-1 text-base text-ink">My first role in software or embedded systems.</p>
        <a
          href="#contact"
          className="mt-4 inline-flex min-h-11 items-center rounded-full bg-navy px-5 text-sm font-semibold text-paper hover:bg-ink"
        >
          Let&apos;s talk →
        </a>
      </TimelineRow>
    </ol>
  );
}

function TimelineRow({
  side,
  year,
  children,
}: {
  side: "left" | "right";
  year: React.ReactNode;
  children: React.ReactNode;
}) {
  const cardFirst = side === "left";
  const fromX = cardFirst ? -48 : 48;

  return (
    <li className="relative grid grid-cols-1 gap-4 pb-14 pl-10 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0">
      <motion.span
        aria-hidden="true"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="absolute top-2 left-0 h-4 w-4 rounded-full border-[3px] border-paper bg-navy md:left-1/2 md:-translate-x-1/2"
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, x: -fromX }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`hidden text-5xl leading-none font-bold tracking-tight text-navy md:block lg:text-6xl ${
          cardFirst ? "md:order-2 md:text-left" : "md:text-right"
        }`}
      >
        {year}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: fromX }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`rounded-2xl border border-navy/10 bg-white/70 p-6 ${cardFirst ? "md:order-1" : ""}`}
      >
        {children}
      </motion.div>
    </li>
  );
}

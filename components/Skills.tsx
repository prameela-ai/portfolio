"use client";

import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { skillFamilies, skills, type SkillFamily } from "@/lib/content";

// One tint per family, like the colour blocks of a periodic table.
const familyStyle: Record<SkillFamily, string> = {
  Languages: "bg-[#f3dccb] border-[#d9a37f]",
  Web: "bg-[#d8e3f1] border-[#8ea8cc]",
  AI: "bg-[#e6dcf0] border-[#ad93c9]",
  Hardware: "bg-[#d6eadf] border-[#86b89c]",
  Protocols: "bg-[#f1e7c6] border-[#cdb36a]",
  Tools: "bg-[#e3e1dc] border-[#a9a397]",
};

// Tiles appear one after another, like elements filling in a table.
const grid: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.035 } } };
const tile: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } },
};

export function Skills() {
  const [filter, setFilter] = useState<SkillFamily | "All">("All");
  const [selected, setSelected] = useState(skills[0].symbol);
  const current = skills.find((s) => s.symbol === selected) ?? skills[0];

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_300px]">
      <div>
        <div role="group" aria-label="Filter skills by family" className="mb-6 flex flex-wrap gap-2">
          {(["All", ...skillFamilies] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors ${
                filter === f ? "border-navy bg-navy text-paper" : "border-navy/20 text-navy hover:border-navy"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.ul
          className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5"
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {skills.map((s, i) => {
            const dimmed = filter !== "All" && s.family !== filter;
            const isSelected = s.symbol === selected;
            return (
              <motion.li key={s.symbol} variants={tile}>
                <button
                  type="button"
                  onClick={() => setSelected(s.symbol)}
                  onMouseEnter={() => setSelected(s.symbol)}
                  onFocus={() => setSelected(s.symbol)}
                  aria-pressed={isSelected}
                  className={`relative flex aspect-square w-full flex-col items-center justify-center rounded-lg border-2 transition-[opacity,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                    familyStyle[s.family]
                  } ${dimmed ? "opacity-25" : "opacity-100"} ${isSelected ? "ring-2 ring-navy ring-offset-2 ring-offset-paper" : ""}`}
                >
                  <span aria-hidden="true" className="absolute top-1.5 left-2 text-[10px] font-semibold text-navy/80">
                    {i + 1}
                  </span>
                  <span aria-hidden="true" className="text-3xl font-bold text-navy md:text-4xl">
                    {s.symbol}
                  </span>
                  <span className="mt-1 px-1 text-center text-[11px] leading-tight font-medium text-navy/80 md:text-xs">
                    {s.name}
                    <span className="sr-only"> ({s.family})</span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      <aside aria-live="polite" className="h-fit overflow-hidden rounded-2xl border border-navy/10 bg-white/70 p-6 md:sticky md:top-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ rotate: -12, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
              className={`flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 ${familyStyle[current.family]}`}
            >
              <span className="text-4xl font-bold text-navy">{current.symbol}</span>
            </motion.div>
            <p className="mt-4 text-xs font-semibold tracking-[0.15em] text-muted uppercase">{current.family}</p>
            <p className="text-2xl font-bold text-navy">{current.name}</p>
            <p className="mt-3 text-base leading-relaxed text-ink">{current.used}</p>
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
  );
}

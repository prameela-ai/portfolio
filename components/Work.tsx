"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { canProject, projects } from "@/lib/content";
import { Tag } from "./ui";

const phaseStyle: Record<string, string> = {
  "In progress": "bg-navy text-paper",
  Next: "bg-navy/10 text-navy",
  Later: "bg-transparent text-muted border border-navy/15",
};

const spring = { type: "spring", stiffness: 170, damping: 26 } as const;

// Sideways accordion: one project is open; the others are narrow tabs with vertical titles.
export function Work() {
  const [open, setOpen] = useState(projects[0].id);

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {projects.map((p, i) => {
        const isOpen = p.id === open;
        const number = String(i + 1).padStart(2, "0");

        if (!isOpen) {
          return (
            <motion.button
              layout
              transition={spring}
              key={p.id}
              type="button"
              onClick={() => setOpen(p.id)}
              aria-expanded={false}
              aria-controls={`project-${p.id}`}
              className="group flex shrink-0 items-center justify-between gap-4 rounded-3xl border border-navy/10 bg-white/50 p-5 text-left transition-colors hover:bg-white md:w-24 md:flex-col md:py-8"
            >
              <span className="text-xs font-semibold tracking-[0.15em] text-muted">{number}</span>
              <span className="text-lg font-bold text-navy md:rotate-180 md:[writing-mode:vertical-rl]">{p.short}</span>
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-lg text-paper transition-transform group-hover:rotate-90"
              >
                +
              </span>
            </motion.button>
          );
        }

        return (
          <motion.article
            layout
            transition={spring}
            key={p.id}
            id={`project-${p.id}`}
            className="flex-1 overflow-hidden rounded-3xl border border-navy/10 bg-white/70 p-6 md:p-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
              >
                <p className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">
                  {number} · {p.meta}
                </p>
                <h3 className="mt-3 text-2xl leading-tight font-bold text-navy md:text-3xl">{p.title}</h3>
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink">{p.summary}</p>
                <ul className="mt-6 max-w-3xl space-y-2 text-base text-ink">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
                {p.id === "can" && (
                  <ol aria-label="Project phases" className="mt-8 grid gap-3 sm:grid-cols-3">
                    {canProject.phases.map((ph, k) => (
                      <motion.li
                        key={ph.name}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + k * 0.08 }}
                        className="rounded-2xl border border-navy/10 bg-paper p-4"
                      >
                        <p className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">{ph.name}</p>
                        <p className="mt-1 font-semibold text-navy">{ph.label}</p>
                        <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${phaseStyle[ph.status]}`}>
                          {ph.status}
                        </span>
                      </motion.li>
                    ))}
                  </ol>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.article>
        );
      })}
    </div>
  );
}

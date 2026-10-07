"use client";

import { useEffect, useState } from "react";
import { sections } from "@/lib/content";

// Floating pill navigation (top right) that highlights the section on screen.
export function Nav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A section counts as "current" when it crosses the middle of the screen.
      { rootMargin: "-50% 0px -50% 0px" },
    );
    const targets = ["top", ...sections.map((s) => s.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-3 top-3 z-50 flex justify-center md:inset-x-auto md:right-6 md:top-5"
    >
      <ul className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-navy/10 bg-paper/80 p-1 shadow-sm backdrop-blur-md">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`block rounded-full px-3 py-2 text-xs font-semibold transition-colors md:px-4 md:text-sm ${
                  isActive ? "bg-navy text-paper" : "text-navy hover:bg-navy/5"
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

"use client";

import { MotionConfig } from "motion/react";

// Turns animations off for visitors whose device asks for reduced motion.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

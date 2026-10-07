"use client";

import { useEffect, useState } from "react";

// Becomes true once the page has fully loaded and the browser is idle,
// so heavy extras (video, 3D) never compete with the first paint.
export function useAfterLoad() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const start = () => {
      if ("requestIdleCallback" in window) window.requestIdleCallback(() => setLoaded(true), { timeout: 2000 });
      else setTimeout(() => setLoaded(true), 200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  return loaded;
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/src/lib/gsap";

const HOVER_COLORS: Record<string, string> = {
  "accent-navy": "var(--color-accent-navy)",
  "accent-blue": "var(--color-accent-blue)",
  "accent-teal": "var(--color-accent-teal)",
  "accent-green": "var(--color-accent-green)",
  link: "var(--color-fg)",
  button: "var(--color-fg)",
};

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!dot || !canHover || reduced) return;

    document.documentElement.classList.add("cursor-custom-active");

    let hasMoved = false;
    const onMove = (e: MouseEvent) => {
      if (!hasMoved) {
        hasMoved = true;
        gsap.set(dot, { opacity: 1 });
      }
      gsap.set(dot, { x: e.clientX, y: e.clientY });
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest<HTMLElement>("[data-cursor]");
      if (!target) return;
      const variant = target.dataset.cursor ?? "";
      dot.style.setProperty("--cursor-color", HOVER_COLORS[variant] ?? "var(--color-fg)");
      gsap.to(dot, { scale: 2.6, duration: 0.4, ease: "easeHover" });
    };

    const onOut = (e: MouseEvent) => {
      const target = (e.target as Element).closest<HTMLElement>("[data-cursor]");
      if (!target) return;
      gsap.to(dot, { scale: 1, duration: 0.4, ease: "easeHover" });
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.documentElement.classList.remove("cursor-custom-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] -ml-1.5 -mt-1.5 h-3 w-3 rounded-full opacity-0 will-change-transform"
      style={{ backgroundColor: "var(--cursor-color, var(--color-fg))" }}
    />
  );
}

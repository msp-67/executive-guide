"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";

export function MagneticButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!canHover || reduced) return;

      const setX = gsap.quickTo(el, "x", { duration: 0.5, ease: "easeHover" });
      const setY = gsap.quickTo(el, "y", { duration: 0.5, ease: "easeHover" });

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        setX(relX * 0.35);
        setY(relY * 0.35);
      };

      const onLeave = () => {
        setX(0);
        setY(0);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className ?? ""}`}>
      {children}
    </div>
  );
}

"use client";

import { useRef, type ReactNode } from "react";
import { useSectionReveal } from "@/src/lib/reveal";

// Wrapper that scroll-reveals every `[data-reveal-section]` inside it, so the
// sections themselves can stay server components.
export function RevealScope({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useSectionReveal(ref);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

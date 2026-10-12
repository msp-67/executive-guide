import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/src/lib/gsap";

// The one scroll-reveal recipe for the whole site — every section fades and
// rises the same distance, at the same pace, from the same trigger point.
const REVEAL = { y: 28, duration: 0.9, stagger: 0.08, start: "top 85%" } as const;

// Lag (seconds) for scroll-scrubbed motion, so it eases after the wheel
// instead of tracking it 1:1.
export const SCRUB_LAG = 0.6;

export function revealItems(targets: gsap.TweenTarget, trigger: gsap.DOMTarget) {
  return gsap.from(targets, {
    opacity: 0,
    y: REVEAL.y,
    duration: REVEAL.duration,
    ease: "easeReveal",
    stagger: REVEAL.stagger,
    scrollTrigger: { trigger, start: REVEAL.start },
  });
}

// Reveals every `[data-reveal]` element inside each `[data-reveal-section]`
// within `scope` as that section scrolls in. Skipped entirely under
// prefers-reduced-motion, leaving the content static and fully visible.
export function useSectionReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The scoped selector only matches descendants, so include the scope
        // element itself when it is the section.
        const sections = gsap.utils.toArray<HTMLElement>("[data-reveal-section]");
        if (scope.current?.matches("[data-reveal-section]")) sections.unshift(scope.current);

        sections.forEach((section) => {
          revealItems(section.querySelectorAll("[data-reveal]"), section);
        });
      });

      return () => mm.revert();
    },
    { scope }
  );
}

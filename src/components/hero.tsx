"use client";

import { useRef } from "react";
import { gsap, SplitText } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";
import { AccentMark } from "@/src/components/accent-mark";
import type { Accent } from "@/src/lib/quadrant-accents";

export function Hero({
  eyebrow,
  title,
  subtitle,
  tagline,
  accent = "navy",
  showScrollHint = false,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  tagline?: string;
  accent?: Accent;
  showScrollHint?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const scrollHintEntranceRef = useRef<HTMLDivElement>(null);
  const scrollHintIconRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = new SplitText(titleRef.current, {
          type: "lines",
          mask: "lines",
          linesClass: "hero-title-line",
          autoSplit: true,
        });

        const tl = gsap.timeline({ delay: 0.3 });

        tl.from(split.lines, {
          yPercent: 110,
          filter: "blur(14px)",
          duration: 1.3,
          ease: "easeReveal",
          stagger: { each: 0.12, ease: "easeReveal" },
        })
          .from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.8, ease: "easeReveal" }, 0)
          .from(".hero-subtitle", { opacity: 0, y: 16, duration: 0.9, ease: "easeReveal" }, 0.6)
          .from(".hero-tagline", { opacity: 0, duration: 0.9, ease: "easeReveal" }, 0.95);

        if (showScrollHint) {
          // Entrance fades a separate inner element — not scrollHintRef itself,
          // which the scroll-driven fade-out below also controls. Two tweens
          // fighting over the same element's opacity would otherwise silently
          // break one of them (learned this the hard way on the manifest logo).
          tl.from(
            scrollHintEntranceRef.current,
            { opacity: 0, duration: 0.8, ease: "easeReveal" },
            1.3
          );

          gsap.to(scrollHintIconRef.current, {
            y: 6,
            duration: 1.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }

        gsap.to(containerRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        return () => split.revert();
      });

      // A simple opacity fade as soon as the user starts scrolling — kept
      // outside the reduced-motion gate above since it's a content-clarity
      // affordance (don't let it hang over content), not ambient motion.
      if (showScrollHint) {
        gsap.to(scrollHintRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150",
            scrub: 0.3,
          },
        });
      }

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <>
      <div ref={containerRef} className="mx-auto max-w-6xl px-6 py-32 sm:py-40">
        <p className="hero-eyebrow flex items-center gap-2.5 text-sm uppercase tracking-[0.25em] text-foreground/50">
          <AccentMark accent={accent} />
          {eyebrow}
        </p>
        <h1
          ref={titleRef}
          className="mt-6 font-serif text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
        >
          {title}
        </h1>
        <p className="hero-subtitle mt-8 max-w-xl text-lg text-foreground/70">
          {subtitle}
        </p>
        {tagline && (
          <p className="hero-tagline mt-16 text-sm uppercase tracking-[0.2em] text-foreground/40">
            {tagline}
          </p>
        )}
      </div>

      {showScrollHint && (
        <div
          ref={scrollHintRef}
          aria-hidden
          className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center sm:bottom-8"
        >
          <div ref={scrollHintEntranceRef}>
            <span ref={scrollHintIconRef} className="block text-foreground/35">
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path
                  d="M1 1L8 8L15 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      )}
    </>
  );
}

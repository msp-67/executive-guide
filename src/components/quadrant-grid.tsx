"use client";

import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { QUADRANT_ACCENTS, type Accent } from "@/src/lib/quadrant-accents";
import { AccentMark } from "@/src/components/accent-mark";

const ACCENT_BG: Record<Accent, string> = {
  navy: "bg-accent-navy",
  blue: "bg-accent-blue",
  teal: "bg-accent-teal",
  green: "bg-accent-green",
};

// Secondary CTA hover shifts to each card's own accent rather than a flat
// foreground — quieter than the primary glass buttons, but still on-palette.
const ACCENT_GROUP_HOVER_TEXT: Record<Accent, string> = {
  navy: "group-hover:text-accent-navy",
  blue: "group-hover:text-accent-blue",
  teal: "group-hover:text-accent-teal",
  green: "group-hover:text-accent-green",
};

// Each card's starting pose before it arrives: far back in depth, scattered
// toward/away from center, gently rotated — converges into the grid on scroll.
const CARD_START = [
  { x: 90, y: 70, z: -650, rotateX: 12, rotateY: -22, rotateZ: -7, scale: 0.42 },
  { x: -90, y: 70, z: -550, rotateX: 12, rotateY: 22, rotateZ: 7, scale: 0.42 },
  { x: 90, y: -70, z: -550, rotateX: -12, rotateY: -22, rotateZ: 7, scale: 0.42 },
  { x: -90, y: -70, z: -650, rotateX: -12, rotateY: 22, rotateZ: -7, scale: 0.42 },
] as const;

const BLUR_START = 20;
const TOTAL_SCROLL_VH = 240;
const ENTRANCE_END = 0.55;
const ENTRANCE_STAGGER_SPREAD = 0.4;
const FOCUS_FRACTION = 0.55;
// How long (in seconds) the animated progress takes to "catch up" to the raw
// scroll position — a manual, frame-rate-independent stand-in for ScrollTrigger's
// scrub option, since we drive the cards from our own ticker rather than scrub
// applied to an attached animation.
const PROGRESS_SMOOTH_TIME = 1.1;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function getIsEligible() {
  return (
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
    window.matchMedia("(min-width: 768px)").matches
  );
}

function subscribe(callback: () => void) {
  const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
  const widthQuery = window.matchMedia("(min-width: 768px)");
  motionQuery.addEventListener("change", callback);
  widthQuery.addEventListener("change", callback);
  return () => {
    motionQuery.removeEventListener("change", callback);
    widthQuery.removeEventListener("change", callback);
  };
}

function getServerSnapshot() {
  return false;
}

function QuadrantCardList({
  lang,
  quadrants,
}: {
  lang: Locale;
  quadrants: Dictionary["quadrants"];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {QUADRANT_ACCENTS.map(({ key, slug, accent }) => {
        const quadrant = quadrants[key];
        return (
          <Link
            key={key}
            href={`/${lang}/${slug}`}
            data-cursor={`accent-${accent}`}
            className="quadrant-card glass group relative overflow-hidden rounded-xl border border-white/55 p-6 transition-transform duration-500 ease-hover hover:-translate-y-1 hover:scale-[1.015] sm:p-7"
          >
            <span
              aria-hidden
              className={`absolute inset-0 -z-10 ${ACCENT_BG[accent]} opacity-0 transition-opacity duration-500 ease-hover group-hover:opacity-15`}
            />
            <p className="flex items-center gap-2.5 text-xs uppercase tracking-[0.18em] text-foreground/40">
              <AccentMark accent={accent} />
              {quadrant.subtitle}
            </p>
            <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              {quadrant.title}
            </h3>
            <p className="mt-3 text-sm text-foreground/70">{quadrant.description}</p>
            <span
              className={`mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-foreground/60 transition-colors ${ACCENT_GROUP_HOVER_TEXT[accent]}`}
            >
              {quadrant.cta}
              <span
                aria-hidden
                className="transition-transform duration-500 ease-hover group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function StaticQuadrantGrid({
  lang,
  quadrants,
}: {
  lang: Locale;
  quadrants: Dictionary["quadrants"];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".quadrant-card", {
          opacity: 0,
          y: 48,
          duration: 1,
          ease: "easeReveal",
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <QuadrantCardList lang={lang} quadrants={quadrants} />
    </section>
  );
}

function PinnedQuadrantGrid({
  lang,
  quadrants,
}: {
  lang: Locale;
  quadrants: Dictionary["quadrants"];
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".quadrant-card", stageRef.current);
      if (cards.length === 0) return;

      gsap.set(stageRef.current, { perspective: 1800 });

      const ease = gsap.parseEase("easeReveal");
      const settled = cards.map(() => false);

      cards.forEach((card, i) => {
        const start = CARD_START[i % CARD_START.length];
        gsap.set(card, {
          ...start,
          opacity: 0,
          filter: `blur(${BLUR_START}px)`,
          transition: "none",
        });
      });

      const trigger = ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top top",
        end: "bottom bottom",
      });

      const applyCards = (progress: number) => {
        cards.forEach((card, i) => {
          const staggerStart =
            (i / Math.max(cards.length - 1, 1)) * ENTRANCE_STAGGER_SPREAD * ENTRANCE_END;
          const staggerDuration = (1 - ENTRANCE_STAGGER_SPREAD) * ENTRANCE_END;
          const raw = (progress - staggerStart) / staggerDuration;
          const t = clamp(raw, 0, 1);

          if (t >= 1) {
            if (!settled[i]) {
              gsap.set(card, {
                clearProps: "transform,filter,opacity,transition,willChange",
              });
              settled[i] = true;
            }
            return;
          }

          settled[i] = false;
          const start = CARD_START[i % CARD_START.length];
          const focusT = ease(clamp(t / FOCUS_FRACTION, 0, 1));
          const settleT = ease(t);

          gsap.set(card, {
            x: lerp(start.x, 0, settleT),
            y: lerp(start.y, 0, settleT),
            z: lerp(start.z, 0, settleT),
            rotateX: lerp(start.rotateX, 0, settleT),
            rotateY: lerp(start.rotateY, 0, settleT),
            rotateZ: lerp(start.rotateZ, 0, settleT),
            scale: lerp(start.scale, 1, focusT),
            opacity: lerp(0, 1, focusT),
            filter: `blur(${lerp(BLUR_START, 0, focusT)}px)`,
            transition: "none",
            willChange: "transform, filter, opacity",
          });
        });
      };

      let smoothedProgress = trigger.progress;
      let lastApplied = -1;

      const tick = (_time: number, deltaTimeMs: number) => {
        const dt = deltaTimeMs / 1000;
        const factor = 1 - Math.exp(-dt / PROGRESS_SMOOTH_TIME);
        smoothedProgress += (trigger.progress - smoothedProgress) * factor;

        if (Math.abs(smoothedProgress - lastApplied) < 0.0002) return;
        lastApplied = smoothedProgress;
        applyCards(smoothedProgress);
      };

      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        trigger.kill();
        cards.forEach((card) =>
          gsap.set(card, { clearProps: "transform,filter,opacity,transition,willChange" })
        );
      };
    },
    { scope: outerRef }
  );

  return (
    <section ref={outerRef} className="relative" style={{ height: `${TOTAL_SCROLL_VH}vh` }}>
      <div className="sticky top-0 flex h-screen w-full items-center overflow-visible bg-background">
        <div ref={stageRef} className="mx-auto w-full max-w-4xl px-6 py-12 sm:py-16">
          <QuadrantCardList lang={lang} quadrants={quadrants} />
        </div>
      </div>
    </section>
  );
}

export function QuadrantGrid({
  lang,
  quadrants,
}: {
  lang: Locale;
  quadrants: Dictionary["quadrants"];
}) {
  const canAnimate3D = useSyncExternalStore(subscribe, getIsEligible, getServerSnapshot);

  if (!canAnimate3D) {
    return <StaticQuadrantGrid lang={lang} quadrants={quadrants} />;
  }

  return <PinnedQuadrantGrid lang={lang} quadrants={quadrants} />;
}

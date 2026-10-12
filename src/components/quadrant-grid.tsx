"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";
import type { Dictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { ACCENT_BG, QUADRANT_ACCENTS, type Accent } from "@/src/lib/quadrant-accents";
import { Eyebrow } from "@/src/components/eyebrow";
import { ArrowLabel } from "@/src/components/arrow-label";
import { useSectionReveal } from "@/src/lib/reveal";

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
// Viewport height the pinned stage keeps free: the fixed header above the
// cards and a small margin below (the sticky container's pt-24 + pb-6).
const STAGE_CLEARANCE = 120;

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
            data-reveal
            className="quadrant-card glass group relative overflow-hidden rounded-card border border-white/55 p-6 transition-transform hover:-translate-y-1 hover:scale-[1.015] sm:p-7"
          >
            <span
              aria-hidden
              className={`absolute inset-0 -z-10 ${ACCENT_BG[accent]} opacity-0 transition-opacity group-hover:opacity-15`}
            />
            <Eyebrow accent={accent} size="sm">
              {quadrant.subtitle}
            </Eyebrow>
            <h3 className="type-title mt-3">{quadrant.title}</h3>
            <p className="mt-3 text-sm text-foreground/70">{quadrant.description}</p>
            <ArrowLabel className={`mt-5 ${ACCENT_GROUP_HOVER_TEXT[accent]}`}>
              {quadrant.cta}
            </ArrowLabel>
          </Link>
        );
      })}
    </div>
  );
}

function StaticQuadrantGrid({
  lang,
  title,
  quadrants,
  contentRef,
}: {
  lang: Locale;
  title: string;
  quadrants: Dictionary["quadrants"];
  contentRef: RefObject<HTMLDivElement | null>;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-reveal-section
      className="container-page py-section-half"
    >
      <div ref={contentRef}>
        <h2 data-reveal className="type-heading mb-8">
          {title}
        </h2>
        <QuadrantCardList lang={lang} quadrants={quadrants} />
      </div>
    </section>
  );
}

function PinnedQuadrantGrid({
  lang,
  title,
  quadrants,
  contentRef,
}: {
  lang: Locale;
  title: string;
  quadrants: Dictionary["quadrants"];
  contentRef: RefObject<HTMLDivElement | null>;
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
      <div className="sticky top-0 flex h-screen w-full items-center overflow-visible bg-background pb-6 pt-24">
        <div className="container-page w-full">
          <div ref={contentRef}>
            <h2 className="type-heading mb-8">{title}</h2>
            <div ref={stageRef}>
              <QuadrantCardList lang={lang} quadrants={quadrants} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function QuadrantGrid({
  lang,
  title,
  quadrants,
}: {
  lang: Locale;
  title: string;
  quadrants: Dictionary["quadrants"];
}) {
  const canAnimate3D = useSyncExternalStore(subscribe, getIsEligible, getServerSnapshot);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(false);
  const pinned = canAnimate3D && fits;

  // The pinned stage is one screen tall, so the heading and all four cards
  // have to fit a single viewport. Both variants render the same content at
  // the same width, so its height is measured in whichever one is showing;
  // when it does not fit, the cards fall back to the static grid.
  useEffect(() => {
    function measure() {
      const content = contentRef.current;
      if (content) setFits(content.offsetHeight <= window.innerHeight - STAGE_CLEARANCE);
    }

    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  if (!pinned) {
    return (
      <StaticQuadrantGrid lang={lang} title={title} quadrants={quadrants} contentRef={contentRef} />
    );
  }

  return (
    <PinnedQuadrantGrid lang={lang} title={title} quadrants={quadrants} contentRef={contentRef} />
  );
}

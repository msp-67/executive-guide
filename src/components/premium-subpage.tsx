"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, SplitText } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/src/dictionaries/locales";
import { MagneticButton } from "@/src/components/magnetic-button";
import { AccentMark } from "@/src/components/accent-mark";
import { CardGrid } from "@/src/components/card-grid";
import { ACCENT_TEXT, ACCENT_BORDER, type Accent } from "@/src/lib/quadrant-accents";

type Section = {
  heading: string;
  items?: string[];
  body?: string;
  numbered?: boolean;
  tone?: string;
};

function sectionId(index: number) {
  return `section-${index}`;
}

// Asymmetric column placement for the heading label + content block, cycled
// by section index — a Swiss-grid rhythm (varying width/offset) instead of
// every section sitting in the same column. Full literal class strings live
// here so Tailwind's scanner picks them up despite the runtime lookup.
const RHYTHM = [
  { label: "sm:col-span-3", content: "sm:col-span-9 sm:col-start-4" },
  { label: "sm:col-span-3", content: "sm:col-span-7 sm:col-start-5" },
  { label: "sm:col-span-3 sm:col-start-2", content: "sm:col-span-8 sm:col-start-5" },
  { label: "sm:col-span-3", content: "sm:col-span-7 sm:col-start-4" },
] as const;

function NumberedSteps({ items, accent }: { items: string[]; accent: Accent }) {
  return (
    <div className="max-w-2xl space-y-10">
      {items.map((item, i) => (
        <div key={item} className="section-item flex items-start gap-5 sm:gap-7">
          <span
            aria-hidden
            className={`select-none font-serif text-5xl font-bold leading-none sm:text-6xl ${ACCENT_TEXT[accent]} opacity-25`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="pt-1 text-lg text-foreground/80 sm:pt-2">{item}</p>
        </div>
      ))}
    </div>
  );
}

function TextBlock({ body, accent }: { body: string; accent: Accent }) {
  return (
    <p
      className={`section-item max-w-2xl border-l-2 ${ACCENT_BORDER[accent]} pl-6 text-lg leading-relaxed text-foreground/80`}
    >
      {body}
    </p>
  );
}

function Callout({ body }: { body: string }) {
  return (
    <div className="section-item glass max-w-2xl rounded-2xl border border-white/55 p-8 shadow-[0_20px_50px_-24px_rgba(20,20,15,0.25)] sm:p-10">
      <p className="text-foreground/85">{body}</p>
    </div>
  );
}

export function PremiumSubpage({
  lang,
  accent,
  hero,
  sections,
  cta,
}: {
  lang: Locale;
  accent: Accent;
  hero: { eyebrow: string; title: string; subtitle: string };
  sections: Section[];
  cta: { title: string; body: string; label: string };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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

        const tl = gsap.timeline({ delay: 0.2 });
        tl.from(split.lines, {
          yPercent: 110,
          filter: "blur(14px)",
          duration: 1.2,
          ease: "easeReveal",
          stagger: { each: 0.1, ease: "easeReveal" },
        })
          .from(".premium-hero-item", { opacity: 0, y: 14, duration: 0.8, ease: "easeReveal" }, 0)
          .from(
            ".premium-nav-pill",
            { opacity: 0, y: 10, duration: 0.6, ease: "easeReveal", stagger: 0.05 },
            0.5
          );

        gsap.utils.toArray<HTMLElement>(".premium-section").forEach((section) => {
          gsap.from(section.querySelectorAll(".section-item"), {
            opacity: 0,
            y: 28,
            duration: 0.9,
            ease: "easeReveal",
            stagger: 0.08,
            scrollTrigger: { trigger: section, start: "top 85%" },
          });

          // Eyebrow accent line draws in left-to-right as the section
          // arrives, instead of just fading with everything else.
          const mark = section.querySelector(".section-accent-mark");
          if (mark) {
            gsap.fromTo(
              mark,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.7,
                ease: "easeReveal",
                scrollTrigger: { trigger: section, start: "top 85%" },
              }
            );
          }

          // Depth cue: the giant ghost numeral drifts at a slightly
          // different rate than the section's own scroll — a faint layer
          // sitting further back, not pinned to the foreground content.
          const watermark = section.querySelector(".section-watermark");
          if (watermark) {
            gsap.fromTo(
              watermark,
              { yPercent: -12 },
              {
                yPercent: 12,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef}>
      <div className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
        <p className="premium-hero-item flex items-center gap-2.5 text-sm uppercase tracking-[0.25em] text-foreground/50">
          <AccentMark accent={accent} />
          {hero.eyebrow}
        </p>
        <h1
          ref={titleRef}
          className="mt-6 max-w-3xl font-serif text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl"
        >
          {hero.title}
        </h1>
        <p className="premium-hero-item mt-8 max-w-xl text-lg text-foreground/70">
          {hero.subtitle}
        </p>
        <nav className="mt-10 flex flex-wrap gap-2">
          {sections.map((section, i) => (
            <a
              key={section.heading}
              href={`#${sectionId(i)}`}
              className={`premium-nav-pill rounded-full border border-foreground/15 px-4 py-1.5 text-xs uppercase tracking-[0.12em] text-foreground/60 transition-colors hover:border-foreground/30 hover:text-foreground`}
            >
              {section.heading}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 sm:pb-32">
        <div className="space-y-28 sm:space-y-40">
          {sections.map((section, i) => {
            const rhythm = RHYTHM[i % RHYTHM.length];
            return (
              <section
                key={section.heading}
                id={sectionId(i)}
                className="premium-section relative pt-2 sm:pt-4"
              >
                <div
                  aria-hidden
                  className="section-watermark pointer-events-none absolute -top-6 left-0 -z-10 select-none font-serif text-[5.5rem] font-bold leading-none text-foreground/[0.05] sm:-top-10 sm:text-[8.5rem]"
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="relative z-10 grid grid-cols-1 gap-y-6 sm:grid-cols-12 sm:gap-x-8">
                  <div className={rhythm.label}>
                    <h2 className="section-item flex items-center gap-2.5 text-sm uppercase tracking-[0.2em] text-foreground/40">
                      <AccentMark accent={accent} className="section-accent-mark origin-left" />
                      {section.heading}
                    </h2>
                  </div>

                  <div className={rhythm.content}>
                    {section.items ? (
                      section.numbered ? (
                        <NumberedSteps items={section.items} accent={accent} />
                      ) : (
                        <CardGrid items={section.items} accent={accent} elevated />
                      )
                    ) : section.body ? (
                      section.tone === "callout" ? (
                        <Callout body={section.body} />
                      ) : (
                        <TextBlock body={section.body} accent={accent} />
                      )
                    ) : null}
                  </div>
                </div>
              </section>
            );
          })}

          <div className="premium-section relative pt-2 sm:pt-4">
            <h2 className="section-item font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              {cta.title}
            </h2>
            <p className="section-item mt-4 max-w-2xl text-foreground/70">{cta.body}</p>
            <MagneticButton className="section-item mt-8">
              <Link
                href={`/${lang}/contact`}
                data-cursor={`accent-${accent}`}
                className="glass-button inline-flex items-center gap-3 rounded-full border border-white/55 px-8 py-4 text-sm uppercase tracking-[0.15em] hover:border-white/85"
              >
                {cta.label}
                <span aria-hidden>→</span>
              </Link>
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}

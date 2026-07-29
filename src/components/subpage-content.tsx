"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/src/dictionaries/locales";
import { MagneticButton } from "@/src/components/magnetic-button";
import { Portrait } from "@/src/components/portrait";
import { AccentMark } from "@/src/components/accent-mark";
import { CardGrid, type CardItem } from "@/src/components/card-grid";
import type { Accent } from "@/src/lib/quadrant-accents";

type Section = {
  heading: string;
  body?: string;
  items?: string[];
  cards?: CardItem[];
  tone?: string;
  accent?: string;
};

const ACCENT_TEXT: Record<Accent, string> = {
  navy: "text-accent-navy",
  blue: "text-accent-blue",
  teal: "text-accent-teal",
  green: "text-accent-green",
};

function SectionBody({
  section,
  markerClass,
  accent,
}: {
  section: Section;
  markerClass: string;
  accent: Accent;
}) {
  const resolved = (section.accent as Accent | undefined) ?? accent;

  return (
    <>
      <h2 className="subpage-section-item flex items-center gap-2.5 text-sm uppercase tracking-[0.2em] text-foreground/40">
        <AccentMark accent={resolved} />
        {section.heading}
      </h2>
      {section.body && (
        <p className="subpage-section-item mt-4 max-w-2xl text-foreground/80">
          {section.body}
        </p>
      )}
      {section.cards && (
        <div className="mt-6">
          <CardGrid items={section.cards} accent={resolved} />
        </div>
      )}
      {section.items && (
        <ul className="mt-4 space-y-3">
          {section.items.map((item) => (
            <li key={item} className="subpage-section-item flex gap-3 text-foreground/80">
              <span aria-hidden className={`mt-[2px] ${markerClass}`}>
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function SubpageContent({
  lang,
  accent,
  sections,
  cta,
  portrait,
}: {
  lang: Locale;
  accent?: Accent;
  sections: Section[];
  cta?: { title: string; body: string; label: string };
  portrait?: { alt: string };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resolvedAccent = accent ?? "teal";
  const markerClass = accent ? ACCENT_TEXT[accent] : "text-foreground/40";
  const [firstSection, ...restSections] = sections;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".subpage-section").forEach((section) => {
          const targets = section.querySelectorAll<HTMLElement>(".subpage-section-item");
          gsap.from(targets, {
            opacity: 0,
            y: 28,
            duration: 0.9,
            ease: "easeReveal",
            stagger: 0.08,
            scrollTrigger: { trigger: section, start: "top 85%" },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="space-y-20">
        {firstSection && (
          <div
            className={`subpage-section ${
              portrait
                ? "grid items-start gap-8 sm:grid-cols-[18rem_1fr] sm:gap-12"
                : ""
            } ${
              firstSection.tone === "callout"
                ? "glass rounded-2xl border border-white/55 p-8 sm:p-10"
                : ""
            }`}
          >
            {portrait && (
              <Portrait
                k="about"
                alt={portrait.alt}
                size="lg"
                priority
                className="subpage-section-item w-40 sm:w-full"
              />
            )}
            <div>
              <SectionBody
                section={firstSection}
                markerClass={markerClass}
                accent={resolvedAccent}
              />
            </div>
          </div>
        )}

        {restSections.map((section) => (
          <div
            key={section.heading}
            className={`subpage-section ${
              section.tone === "callout"
                ? "glass rounded-2xl border border-white/55 p-8 sm:p-10"
                : ""
            }`}
          >
            <SectionBody
              section={section}
              markerClass={markerClass}
              accent={resolvedAccent}
            />
          </div>
        ))}

        {cta && (
          <div className="subpage-section">
            <h2 className="subpage-section-item font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              {cta.title}
            </h2>
            <p className="subpage-section-item mt-4 max-w-2xl text-foreground/70">
              {cta.body}
            </p>
            <MagneticButton className="subpage-section-item mt-8">
              <Link
                href={`/${lang}/contact`}
                data-cursor={accent ? `accent-${accent}` : "button"}
                className="glass-button inline-flex items-center gap-3 rounded-full border border-white/55 px-8 py-4 text-sm uppercase tracking-[0.15em] hover:border-white/85"
              >
                {cta.label}
                <span aria-hidden>→</span>
              </Link>
            </MagneticButton>
          </div>
        )}
      </div>
    </div>
  );
}

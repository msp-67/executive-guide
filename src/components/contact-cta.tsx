"use client";

import { useRef } from "react";
import type { Locale } from "@/src/dictionaries/locales";
import { CtaButton } from "@/src/components/cta-button";
import { useSectionReveal } from "@/src/lib/reveal";

export function ContactCta({
  lang,
  title,
  body,
  cta,
}: {
  lang: Locale;
  title: string;
  body: string;
  cta: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-reveal-section
      className="mx-auto max-w-3xl px-6 pb-section pt-section-half text-center"
    >
      <h2 data-reveal className="type-heading">
        {title}
      </h2>
      <p data-reveal className="mx-auto mt-6 max-w-xl text-foreground/70">
        {body}
      </p>
      <div data-reveal className="mt-10">
        <CtaButton href={`/${lang}/contact`}>{cta}</CtaButton>
      </div>
    </section>
  );
}

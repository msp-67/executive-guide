"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/src/dictionaries/locales";
import { MagneticButton } from "@/src/components/magnetic-button";

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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".contact-reveal", {
          opacity: 0,
          y: 32,
          duration: 1,
          ease: "easeReveal",
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-40">
      <h2 className="contact-reveal font-serif text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="contact-reveal mx-auto mt-6 max-w-xl text-foreground/70">{body}</p>
      <MagneticButton className="contact-reveal mt-10">
        <Link
          href={`/${lang}/contact`}
          data-cursor="button"
          className="glass-button inline-flex items-center gap-3 rounded-full border border-white/55 px-8 py-4 text-sm uppercase tracking-[0.15em] hover:border-white/85"
        >
          {cta}
          <span aria-hidden>→</span>
        </Link>
      </MagneticButton>
    </section>
  );
}

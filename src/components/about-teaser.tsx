"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/src/dictionaries/locales";
import { Portrait } from "@/src/components/portrait";

export function AboutTeaser({
  lang,
  title,
  body,
  cta,
  photoAlt,
}: {
  lang: Locale;
  title: string;
  body: string;
  cta: string;
  photoAlt: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".about-reveal", {
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
    <section ref={sectionRef} className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <div className="grid items-start gap-8 sm:grid-cols-[14rem_1fr] sm:gap-12">
        <Portrait
          k="home"
          alt={photoAlt}
          className="about-reveal w-36 sm:w-full"
        />
        <div>
          <h2 className="about-reveal font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="about-reveal mt-6 text-foreground/70">{body}</p>
          <Link
            href={`/${lang}/about`}
            data-cursor="button"
            className="about-reveal group mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-foreground/70 transition-colors hover:text-accent-teal"
          >
            {cta}
            <span
              aria-hidden
              className="transition-transform duration-500 ease-hover group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

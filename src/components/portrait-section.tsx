"use client";

import Link from "next/link";
import { useRef } from "react";
import { Portrait } from "@/src/components/portrait";
import { ArrowLabel } from "@/src/components/arrow-label";
import { useSectionReveal } from "@/src/lib/reveal";
import type { PortraitKey } from "@/src/lib/portraits";

// A heading and a paragraph beside a portrait — the home page's opening
// statement and its short "about" block. `link` adds a read-more link.
export function PortraitSection({
  portrait,
  photoAlt,
  title,
  body,
  link,
}: {
  portrait: PortraitKey;
  photoAlt: string;
  title: string;
  body: string;
  link?: { href: string; label: string };
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      data-reveal-section
      className="mx-auto max-w-4xl px-6 py-section-half"
    >
      <div className="grid items-start gap-8 sm:grid-cols-[14rem_1fr] sm:gap-12">
        <div data-reveal>
          <Portrait k={portrait} alt={photoAlt} className="w-36 sm:w-full" />
        </div>
        <div>
          <h2 data-reveal className="type-heading">
            {title}
          </h2>
          <p data-reveal className="mt-6 text-foreground/70">
            {body}
          </p>
          {link && (
            <div data-reveal className="mt-8">
              <Link href={link.href} data-cursor="button" className="group inline-flex">
                <ArrowLabel className="group-hover:text-accent-navy">{link.label}</ArrowLabel>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

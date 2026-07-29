"use client";

import { useRef, type FormEvent } from "react";
import { gsap } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";
import { MagneticButton } from "@/src/components/magnetic-button";

export function ContactContent({
  email,
  linkedin,
  note,
  form,
}: {
  email: { label: string; value: string };
  linkedin: { label: string; value: string };
  note: string;
  form: { name: string; email: string; message: string; submit: string };
}) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div ref={containerRef} className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
      <div className="grid gap-16 sm:grid-cols-2">
        <div className="subpage-section space-y-8">
          <div className="subpage-section-item space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/40">
                {email.label}
              </p>
              <a
                href={`mailto:${email.value}`}
                data-cursor="link"
                className="mt-1 inline-block text-lg transition-colors hover:text-foreground/70"
              >
                {email.value}
              </a>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/40">
                {linkedin.label}
              </p>
              <a
                href={linkedin.value}
                data-cursor="link"
                className="mt-1 inline-block text-lg transition-colors hover:text-foreground/70"
              >
                {linkedin.value}
              </a>
            </div>
          </div>

          <p className="subpage-section-item max-w-md text-sm text-foreground/50">{note}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass subpage-section space-y-6 rounded-2xl border border-white/55 p-8 sm:p-10"
        >
          <div className="subpage-section-item">
            <label
              htmlFor="contact-name"
              className="text-sm uppercase tracking-[0.2em] text-foreground/40"
            >
              {form.name}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              className="mt-2 w-full border-b border-foreground/15 bg-transparent py-2 text-foreground outline-none transition-colors focus:border-foreground/40"
            />
          </div>
          <div className="subpage-section-item">
            <label
              htmlFor="contact-email"
              className="text-sm uppercase tracking-[0.2em] text-foreground/40"
            >
              {form.email}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              className="mt-2 w-full border-b border-foreground/15 bg-transparent py-2 text-foreground outline-none transition-colors focus:border-foreground/40"
            />
          </div>
          <div className="subpage-section-item">
            <label
              htmlFor="contact-message"
              className="text-sm uppercase tracking-[0.2em] text-foreground/40"
            >
              {form.message}
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              className="mt-2 w-full resize-none border-b border-foreground/15 bg-transparent py-2 text-foreground outline-none transition-colors focus:border-foreground/40"
            />
          </div>
          <MagneticButton className="subpage-section-item">
            <button
              type="submit"
              data-cursor="button"
              className="glass-button inline-flex items-center gap-3 rounded-full border border-white/55 px-8 py-4 text-sm uppercase tracking-[0.15em] hover:border-white/85"
            >
              {form.submit}
              <span aria-hidden>→</span>
            </button>
          </MagneticButton>
        </form>
      </div>
    </div>
  );
}

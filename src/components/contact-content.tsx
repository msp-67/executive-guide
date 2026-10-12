"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/src/dictionaries/locales";
import { CtaButton } from "@/src/components/cta-button";
import { RichText, type LinkedText } from "@/src/components/site-link";
import { useSectionReveal } from "@/src/lib/reveal";

const FIELD_CLASS =
  "mt-2 w-full border-b border-foreground/15 bg-transparent py-2 text-foreground outline-none transition-colors focus:border-foreground/40";
const CONTACT_LINK_CLASS = "mt-1 inline-block text-lg transition-colors hover:text-foreground/70";

export function ContactContent({
  lang,
  email,
  phone,
  linkedin,
  where,
  note,
  form,
}: {
  lang: Locale;
  email: { label: string; value: string };
  phone: { label: string; value: string };
  linkedin: { label: string; value: string; href: string };
  where: string;
  note: string;
  form: {
    name: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    privacy: LinkedText;
    success: string;
  };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);

  useSectionReveal(containerRef);

  // TODO: the form is not connected to any sending service yet — nothing
  // leaves the browser. Send the fields here and show the confirmation only
  // once that has succeeded.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div ref={containerRef} className="container-page pb-section">
      <div className="grid gap-16 sm:grid-cols-2">
        <div data-reveal-section className="space-y-8">
          <div data-reveal className="space-y-4">
            <div>
              <p className="type-label">{email.label}</p>
              <a href={`mailto:${email.value}`} data-cursor="link" className={CONTACT_LINK_CLASS}>
                {email.value}
              </a>
            </div>
            <div>
              <p className="type-label">{phone.label}</p>
              <a
                href={`tel:${phone.value.replace(/\s/g, "")}`}
                data-cursor="link"
                className={CONTACT_LINK_CLASS}
              >
                {phone.value}
              </a>
            </div>
            <div>
              <p className="type-label">{linkedin.label}</p>
              <a
                href={linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className={CONTACT_LINK_CLASS}
              >
                {linkedin.value}
              </a>
            </div>
          </div>

          <p data-reveal className="max-w-md text-foreground/70">
            {where}
          </p>
          <p data-reveal className="max-w-md text-sm text-foreground/50">
            {note}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          data-reveal-section
          className="glass space-y-6 rounded-panel border border-white/55 p-8 sm:p-10"
        >
          {sent ? (
            <p role="status" className="text-lg text-foreground/80">
              {form.success}
            </p>
          ) : (
            <>
              <div data-reveal>
                <label htmlFor="contact-name" className="type-label">
                  {form.name}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className={FIELD_CLASS}
                />
              </div>
              <div data-reveal>
                <label htmlFor="contact-email" className="type-label">
                  {form.email}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={FIELD_CLASS}
                />
              </div>
              <div data-reveal>
                <label htmlFor="contact-phone" className="type-label">
                  {form.phone}
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={FIELD_CLASS}
                />
              </div>
              <div data-reveal>
                <label htmlFor="contact-message" className="type-label">
                  {form.message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  className={`${FIELD_CLASS} resize-none`}
                />
              </div>
              <div data-reveal>
                <CtaButton>{form.submit}</CtaButton>
              </div>
              <p data-reveal className="text-sm text-foreground/50">
                <RichText value={form.privacy} lang={lang} />
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

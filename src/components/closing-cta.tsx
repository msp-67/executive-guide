import type { Locale } from "@/src/dictionaries/locales";
import { CtaButton } from "@/src/components/cta-button";
import type { Accent } from "@/src/lib/quadrant-accents";

// Headings up to this length are set as a display line; longer ones are whole
// sentences and read better a size down, on a narrower measure.
const DISPLAY_MAX_LENGTH = 60;

// The closing call to action of a subpage.
export function ClosingCta({
  lang,
  accent,
  title,
  body,
  label,
}: {
  lang: Locale;
  accent: Accent;
  title: string;
  body: string;
  label: string;
}) {
  return (
    <div data-reveal-section>
      <h2
        data-reveal
        className={title.length > DISPLAY_MAX_LENGTH ? "type-title max-w-3xl" : "type-heading"}
      >
        {title}
      </h2>
      <p data-reveal className="mt-4 max-w-2xl text-foreground/70">
        {body}
      </p>
      <div data-reveal className="mt-8">
        <CtaButton href={`/${lang}/contact`} cursor={`accent-${accent}`}>
          {label}
        </CtaButton>
      </div>
    </div>
  );
}

import type { Locale } from "@/src/dictionaries/locales";
import { Hero } from "@/src/components/hero";
import { CardGrid } from "@/src/components/card-grid";
import { ClosingCta } from "@/src/components/closing-cta";
import { NumberedSteps } from "@/src/components/numbered-steps";
import { RevealScope } from "@/src/components/reveal-scope";
import { SectionRow } from "@/src/components/section-row";
import { RichText, type RichTextValue } from "@/src/components/site-link";
import { Callout, Note, TextBlock } from "@/src/components/text-block";
import type { Accent } from "@/src/lib/quadrant-accents";

// One section of a service page, as the dictionary describes it. A section
// has cards (`items`), numbered `steps` or running `paragraphs`; the rest is
// optional framing around that content.
type Section = {
  // Label of the quick link in the hero; sections without one get no link.
  nav?: string;
  heading?: string;
  // The heading is a full sentence: set it as a title above the content and
  // use the short `nav` label beside it.
  titled?: boolean;
  items?: RichTextValue[];
  // Items open with a term to emphasise: "dash" or "sentence" (see CardGrid).
  lead?: string;
  steps?: string[];
  paragraphs?: string[];
  tone?: string;
  // A paragraph set apart in a panel below the content.
  box?: RichTextValue;
  // A paragraph under the content.
  after?: RichTextValue;
  // A quiet closing line (credentials).
  note?: string;
};

function sectionId(index: number) {
  return `section-${index}`;
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
  return (
    <>
      <Hero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        accent={accent}
        statement
      >
        <nav className="flex flex-wrap gap-2">
          {sections.map(
            (section, i) =>
              section.nav && (
                <a
                  key={section.nav}
                  href={`#${sectionId(i)}`}
                  className="type-action-sm rounded-full border border-foreground/15 px-4 py-1.5 text-foreground/60 transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  {section.nav}
                </a>
              )
          )}
        </nav>
      </Hero>

      <RevealScope className="container-page space-y-section pb-section">
        {sections.map((section, i) => (
          <SectionRow
            key={i}
            id={sectionId(i)}
            label={section.titled ? section.nav : section.heading}
            labelAs={section.titled ? "p" : "h2"}
            accent={accent}
          >
            {section.titled && (
              <h2 data-reveal className="type-title mb-8 max-w-2xl">
                {section.heading}
              </h2>
            )}
            {section.items && (
              <CardGrid items={section.items} accent={accent} lang={lang} lead={section.lead} />
            )}
            {section.steps && <NumberedSteps items={section.steps} accent={accent} />}
            {section.paragraphs &&
              (section.tone === "callout" ? (
                <Callout>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </Callout>
              ) : (
                <TextBlock paragraphs={section.paragraphs} accent={accent} />
              ))}
            {section.box && (
              <div className="mt-8">
                <Callout>
                  <p>
                    <RichText value={section.box} lang={lang} />
                  </p>
                </Callout>
              </div>
            )}
            {section.after && (
              <p data-reveal className="mt-8 max-w-2xl text-foreground/70">
                <RichText value={section.after} lang={lang} />
              </p>
            )}
            {section.note && <Note>{section.note}</Note>}
          </SectionRow>
        ))}

        <ClosingCta lang={lang} accent={accent} title={cta.title} body={cta.body} label={cta.label} />
      </RevealScope>
    </>
  );
}

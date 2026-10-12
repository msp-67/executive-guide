import type { Metadata } from "next";
import { getDictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { pageMetadata } from "@/src/lib/metadata";
import { Hero } from "@/src/components/hero";
import { AboutTimeline } from "@/src/components/about-timeline";
import { CardGrid } from "@/src/components/card-grid";
import { ClosingCta } from "@/src/components/closing-cta";
import { Portrait } from "@/src/components/portrait";
import { RevealScope } from "@/src/components/reveal-scope";
import { SectionRow } from "@/src/components/section-row";
import { Note, TextBlock } from "@/src/components/text-block";
import type { Accent } from "@/src/lib/quadrant-accents";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadata((await params).lang, "about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.pages.about;

  return (
    <>
      <Hero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        subtitle={page.hero.subtitle}
        statement
      />

      <RevealScope className="container-page space-y-section pb-section">
        <SectionRow label={page.why.heading} accent="navy">
          <div data-reveal>
            <Portrait k="about" alt={page.photoAlt} size="lg" priority className="w-36 sm:w-44" />
          </div>
          <div className="mt-10">
            <TextBlock paragraphs={page.why.paragraphs} accent="navy" />
          </div>
        </SectionRow>

        <AboutTimeline heading={page.timeline.heading} milestones={page.timeline.milestones} />

        {page.sections.map((section, i) => {
          const accent = section.accent as Accent;
          return (
            <SectionRow key={section.heading} label={section.heading} accent={accent}>
              <CardGrid items={section.items} accent={accent} lang={lang} lead="dash" />
              {i === page.sections.length - 1 && <Note>{page.languages}</Note>}
            </SectionRow>
          );
        })}

        <ClosingCta
          lang={lang}
          accent="navy"
          title={page.cta.title}
          body={page.cta.body}
          label={page.cta.label}
        />
      </RevealScope>
    </>
  );
}

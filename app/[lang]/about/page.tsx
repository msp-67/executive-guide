import { getDictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { Hero } from "@/src/components/hero";
import { AboutTimeline } from "@/src/components/about-timeline";
import { SubpageContent } from "@/src/components/subpage-content";

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
      />
      <AboutTimeline
        heading={page.timeline.heading}
        intro={page.timeline.intro}
        milestones={page.timeline.milestones}
        portraitAlt={page.photoAlt}
      />
      <SubpageContent lang={lang} accent="navy" sections={page.sections} />
    </>
  );
}

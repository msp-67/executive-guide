import { getDictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { Hero } from "@/src/components/hero";
import { Manifest } from "@/src/components/manifest";
import { QuadrantGrid } from "@/src/components/quadrant-grid";
import { AboutTeaser } from "@/src/components/about-teaser";
import { ContactCta } from "@/src/components/contact-cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero
        eyebrow={dict.hero.eyebrow}
        title={dict.hero.title}
        subtitle={dict.hero.subtitle}
        tagline={dict.hero.tagline}
        showScrollHint
      />
      <Manifest body={dict.manifest.body} />
      <QuadrantGrid lang={lang} quadrants={dict.quadrants} />
      <AboutTeaser
        lang={lang}
        title={dict.about.title}
        body={dict.about.body}
        cta={dict.about.cta}
        photoAlt={dict.about.photoAlt}
      />
      <ContactCta
        lang={lang}
        title={dict.contact.title}
        body={dict.contact.body}
        cta={dict.contact.cta}
      />
    </>
  );
}

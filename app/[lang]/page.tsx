import type { Metadata } from "next";
import { getDictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { pageMetadata } from "@/src/lib/metadata";
import { routePath } from "@/src/lib/routes";
import { Hero } from "@/src/components/hero";
import { PortraitSection } from "@/src/components/portrait-section";
import { QuadrantGrid } from "@/src/components/quadrant-grid";
import { ContactCta } from "@/src/components/contact-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadata((await params).lang, "home");
}

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
        credentials={dict.hero.credentials}
        showScrollHint
      />
      <PortraitSection
        portrait="intro"
        photoAlt={dict.intro.photoAlt}
        title={dict.intro.title}
        body={dict.intro.body}
      />
      <QuadrantGrid lang={lang} title={dict.services.title} quadrants={dict.quadrants} />
      <PortraitSection
        portrait="home"
        photoAlt={dict.about.photoAlt}
        title={dict.about.title}
        body={dict.about.body}
        link={{ href: routePath(lang, "about"), label: dict.about.cta }}
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

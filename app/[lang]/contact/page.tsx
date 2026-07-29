import { getDictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { Hero } from "@/src/components/hero";
import { ContactContent } from "@/src/components/contact-content";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.pages.contact;

  return (
    <>
      <Hero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        subtitle={page.hero.subtitle}
      />
      <ContactContent
        email={page.email}
        linkedin={page.linkedin}
        note={page.note}
        form={page.form}
      />
    </>
  );
}

import type { Metadata } from "next";
import { getDictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { pageMetadata } from "@/src/lib/metadata";
import { Hero } from "@/src/components/hero";
import { ContactContent } from "@/src/components/contact-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadata((await params).lang, "contact");
}

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
        lang={lang}
        email={page.email}
        phone={page.phone}
        linkedin={page.linkedin}
        where={page.where}
        note={page.note}
        form={page.form}
      />
    </>
  );
}

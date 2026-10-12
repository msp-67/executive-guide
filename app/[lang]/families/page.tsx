import type { Metadata } from "next";
import { getDictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { pageMetadata } from "@/src/lib/metadata";
import { PremiumSubpage } from "@/src/components/premium-subpage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return pageMetadata((await params).lang, "families");
}

export default async function FamiliesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.pages.families;

  return (
    <PremiumSubpage
      lang={lang}
      accent="green"
      hero={page.hero}
      sections={page.sections}
      cta={page.cta}
    />
  );
}

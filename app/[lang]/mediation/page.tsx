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
  return pageMetadata((await params).lang, "mediation");
}

export default async function MediationPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.pages.mediation;

  return (
    <PremiumSubpage
      lang={lang}
      accent="teal"
      hero={page.hero}
      sections={page.sections}
      cta={page.cta}
    />
  );
}

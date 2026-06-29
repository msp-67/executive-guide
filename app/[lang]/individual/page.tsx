import { getDictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { PremiumSubpage } from "@/src/components/premium-subpage";

export default async function IndividualPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.pages.individual;

  return (
    <PremiumSubpage
      lang={lang}
      accent="navy"
      hero={page.hero}
      sections={page.sections}
      cta={page.cta}
    />
  );
}

import { getDictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { PremiumSubpage } from "@/src/components/premium-subpage";

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.pages.teams;

  return (
    <PremiumSubpage
      lang={lang}
      accent="blue"
      hero={page.hero}
      sections={page.sections}
      cta={page.cta}
    />
  );
}

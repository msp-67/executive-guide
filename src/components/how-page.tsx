import { getDictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";
import { PremiumSubpage } from "@/src/components/premium-subpage";

// "How I work" — served at a translated address per language
// (app/[lang]/jak-pracuji and app/[lang]/how-i-work).
export async function HowPage({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const page = dict.pages.how;

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

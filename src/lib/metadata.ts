import type { Metadata } from "next";
import { getDictionary, type Dictionary } from "@/src/dictionaries/get-dictionary";
import { defaultLocale, isLocale, type Locale } from "@/src/dictionaries/locales";
import { routePath, type RouteKey } from "@/src/lib/routes";

const OG_LOCALE: Record<Locale, string> = { cs: "cs_CZ", en: "en_GB" };

// Title, description, Open Graph and hreflang for one page. The same title
// and description feed the search result and the link preview.
export async function pageMetadata(
  lang: string,
  page: RouteKey & keyof Dictionary["meta"]
): Promise<Metadata> {
  if (!isLocale(lang)) return {};

  const dict = await getDictionary(lang);
  const { title, description } = dict.meta[page];

  return {
    title,
    description,
    alternates: {
      languages: {
        cs: routePath("cs", page),
        en: routePath("en", page),
        "x-default": routePath(defaultLocale, page),
      },
    },
    openGraph: { title, description, locale: OG_LOCALE[lang] },
  };
}

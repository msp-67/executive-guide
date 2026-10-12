import type { Locale } from "@/src/dictionaries/locales";

// Every page of the site and its address under each language. Most pages
// share one slug; a page whose address is translated lists both.
export const ROUTES = {
  home: { cs: "", en: "" },
  individual: { cs: "individual", en: "individual" },
  teams: { cs: "teams", en: "teams" },
  mediation: { cs: "mediation", en: "mediation" },
  families: { cs: "families", en: "families" },
  how: { cs: "jak-pracuji", en: "how-i-work" },
  about: { cs: "about", en: "about" },
  contact: { cs: "contact", en: "contact" },
  privacy: { cs: "osobni-udaje", en: "privacy" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof ROUTES;

export function isRouteKey(value: string): value is RouteKey {
  return value in ROUTES;
}

export function routePath(lang: Locale, key: RouteKey) {
  const slug = ROUTES[key][lang];
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

// The page a pathname belongs to — used to find the same page in the other language.
export function routeKeyForPath(lang: Locale, pathname: string): RouteKey | undefined {
  return (Object.keys(ROUTES) as RouteKey[]).find((key) => routePath(lang, key) === pathname);
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { locales, type Locale } from "@/src/dictionaries/locales";
import { routeKeyForPath, routePath } from "@/src/lib/routes";

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Unknown paths (the 404 page) fall back to the other language's home page.
  const page = routeKeyForPath(lang, pathname) ?? "home";
  const hrefFor = (locale: Locale) => routePath(locale, page);

  return (
    <div className="flex items-center gap-2 text-sm tracking-wide">
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-2">
          {index > 0 && <span className="text-foreground/30">/</span>}
          {locale === lang ? (
            <span className="text-foreground">{locale.toUpperCase()}</span>
          ) : (
            <Link
              href={hrefFor(locale)}
              data-cursor="link"
              className="text-foreground/50 transition-colors hover:text-foreground"
            >
              {locale.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}

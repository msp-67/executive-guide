"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { locales, type Locale } from "@/src/dictionaries/locales";

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const rest = pathname.split("/").slice(2).join("/");
  const hrefFor = (locale: Locale) => `/${locale}${rest ? `/${rest}` : ""}`;

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

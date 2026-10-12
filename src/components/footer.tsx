import Link from "next/link";
import type { Locale } from "@/src/dictionaries/locales";
import type { Dictionary } from "@/src/dictionaries/get-dictionary";
import { navItems } from "@/src/lib/nav-items";
import { routePath } from "@/src/lib/routes";
import { RichText, SiteLink } from "@/src/components/site-link";

const LINK_CLASS = "transition-colors hover:text-foreground";

export function Footer({
  lang,
  name,
  nav,
  footer,
  linkedinHref,
}: {
  lang: Locale;
  name: string;
  nav: Dictionary["nav"];
  footer: Dictionary["footer"];
  linkedinHref: string;
}) {
  return (
    <footer className="border-t border-foreground/10 py-10 text-sm text-foreground/60">
      <div className="container-page flex flex-col gap-8 md:flex-row md:justify-between md:gap-16">
        <div className="max-w-xl space-y-3">
          <p className="font-serif text-base font-semibold tracking-wide text-foreground">{name}</p>
          <p>{footer.operator}</p>
          <p>
            <RichText value={footer.legal} lang={lang} />
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-2">
            <SiteLink lang={lang} to="privacy" className={LINK_CLASS}>
              {footer.privacy}
            </SiteLink>
            <SiteLink lang={lang} to={linkedinHref} className={LINK_CLASS}>
              {footer.linkedin}
            </SiteLink>
          </p>
          <p>{footer.copyright}</p>
        </div>

        <nav className="grid grid-cols-2 content-start gap-x-8 gap-y-2 md:grid-cols-1">
          {navItems.map((key) => (
            <Link key={key} href={routePath(lang, key)} data-cursor="link" className={LINK_CLASS}>
              {nav[key]}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

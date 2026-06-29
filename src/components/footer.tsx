import Link from "next/link";
import type { Locale } from "@/src/dictionaries/locales";
import type { Dictionary } from "@/src/dictionaries/get-dictionary";
import { navItems } from "@/src/lib/nav-items";

export function Footer({ lang, nav }: { lang: Locale; nav: Dictionary["nav"] }) {
  return (
    <footer className="border-t border-foreground/10 px-6 py-10 text-sm text-foreground/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} Jan Spáčil — Executive Guide</p>
        <nav className="flex flex-wrap gap-4">
          {navItems.map((item) => (
            <Link
              key={item.slug}
              href={`/${lang}/${item.slug}`}
              data-cursor="link"
              className="transition-colors hover:text-foreground"
            >
              {nav[item.key]}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

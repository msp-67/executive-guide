"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ScrollTrigger } from "@/src/lib/gsap";
import { useGSAP } from "@gsap/react";
import type { Locale } from "@/src/dictionaries/locales";
import type { Dictionary } from "@/src/dictionaries/get-dictionary";
import { navItems } from "@/src/lib/nav-items";
import { routePath } from "@/src/lib/routes";
import { LanguageSwitcher } from "@/src/components/language-switcher";
import { MobileNav } from "@/src/components/mobile-nav";

export function Header({
  lang,
  name,
  nav,
}: {
  lang: Locale;
  name: string;
  nav: Dictionary["nav"];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      start: 80,
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
    return () => trigger.kill();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] px-4 transition-[padding] motion-reduce:transition-none sm:px-6 ${
        scrolled ? "pt-3" : "pt-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link
          href={routePath(lang, "home")}
          data-cursor="link"
          className={`glass-header inline-flex items-center whitespace-nowrap rounded-full border border-white/55 px-4 py-2.5 font-serif text-sm font-semibold tracking-wide transition-[padding,font-size] motion-reduce:transition-none ${
            scrolled ? "sm:px-5 sm:text-base" : "sm:px-6 sm:py-3 sm:text-lg"
          }`}
        >
          {name}
        </Link>

        <nav
          className={`glass-header hidden items-center gap-1 rounded-full border border-white/55 transition-[padding] motion-reduce:transition-none nav:flex ${
            scrolled ? "px-2 py-2" : "px-3 py-2.5"
          }`}
        >
          {navItems.map((key) => (
            <Link
              key={key}
              href={routePath(lang, key)}
              data-cursor="link"
              className={`relative whitespace-nowrap px-3 py-1.5 text-sm transition-colors after:absolute after:bottom-0.5 after:left-3 after:right-3 after:h-px after:origin-center after:bg-accent-teal after:transition-transform after:content-[''] motion-reduce:after:transition-none ${
                pathname === routePath(lang, key)
                  ? "text-foreground after:scale-x-100"
                  : "text-foreground/70 after:scale-x-0 hover:text-foreground hover:after:scale-x-100"
              }`}
            >
              {nav[key]}
            </Link>
          ))}
          <span aria-hidden className="mx-1 h-4 w-px bg-foreground/15" />
          <LanguageSwitcher lang={lang} />
        </nav>

        <MobileNav lang={lang} nav={nav} />
      </div>
    </header>
  );
}

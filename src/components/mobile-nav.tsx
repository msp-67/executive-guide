"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/src/dictionaries/locales";
import type { Dictionary } from "@/src/dictionaries/get-dictionary";
import { navItems } from "@/src/lib/nav-items";
import { LanguageSwitcher } from "@/src/components/language-switcher";
import { getLenis } from "@/src/components/smooth-scroll";

export function MobileNav({
  lang,
  nav,
}: {
  lang: Locale;
  nav: Dictionary["nav"];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const isActive = (slug: string) => pathname === `/${lang}/${slug}`;

  useEffect(() => {
    if (open) {
      getLenis()?.stop();
      document.body.style.overflow = "hidden";
      firstLinkRef.current?.focus();
    } else {
      getLenis()?.start();
      document.body.style.overflow = "";
    }
    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Menu"
        data-cursor="button"
        className="glass-header relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/55"
      >
        <span className="relative block h-3.5 w-4">
          <span
            aria-hidden
            className={`absolute left-0 h-px w-4 bg-foreground transition-all duration-300 ease-hover motion-reduce:transition-none ${
              open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
            }`}
          />
          <span
            aria-hidden
            className={`absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-foreground transition-opacity duration-300 ease-hover motion-reduce:transition-none ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            aria-hidden
            className={`absolute left-0 h-px w-4 bg-foreground transition-all duration-300 ease-hover motion-reduce:transition-none ${
              open ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-full"
            }`}
          />
        </span>
      </button>

      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className={`fixed inset-0 z-0 flex flex-col items-center justify-center gap-10 bg-background/98 backdrop-blur-xl transition-opacity duration-300 ease-hover motion-reduce:duration-0 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-6">
          {navItems.map((item, index) => (
            <Link
              key={item.slug}
              ref={index === 0 ? firstLinkRef : undefined}
              href={`/${lang}/${item.slug}`}
              data-cursor="link"
              onClick={() => setOpen(false)}
              className={`font-serif text-3xl tracking-tight transition-colors ${
                isActive(item.slug)
                  ? "text-accent-teal"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {nav[item.key]}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher lang={lang} />
      </div>
    </div>
  );
}

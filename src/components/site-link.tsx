import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/src/dictionaries/locales";
import { isRouteKey, routePath } from "@/src/lib/routes";

// A sentence from the dictionary with phrases inside it turned into links.
// Each `match` is an exact phrase within `text`, listed in the order they
// appear; `to` is a page key from routes.ts or a full URL (https:, tel:, mailto:).
export type LinkedText = { text: string; links: { match: string; to: string }[] };
export type RichTextValue = string | LinkedText;

const INLINE_LINK =
  "underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground/70";

export function SiteLink({
  lang,
  to,
  className,
  children,
}: {
  lang: Locale;
  to: string;
  className?: string;
  children: ReactNode;
}) {
  if (isRouteKey(to)) {
    return (
      <Link href={routePath(lang, to)} data-cursor="link" className={className}>
        {children}
      </Link>
    );
  }

  const external = /^https?:\/\//.test(to);
  return (
    <a
      href={to}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor="link"
      className={className}
    >
      {children}
    </a>
  );
}

export function RichText({ value, lang }: { value: RichTextValue; lang: Locale }) {
  if (typeof value === "string") return value;

  const parts: ReactNode[] = [];
  let rest = value.text;
  for (const link of value.links) {
    const at = rest.indexOf(link.match);
    parts.push(
      rest.slice(0, at),
      <SiteLink key={link.match} lang={lang} to={link.to} className={INLINE_LINK}>
        {link.match}
      </SiteLink>
    );
    rest = rest.slice(at + link.match.length);
  }
  parts.push(rest);

  return <>{parts}</>;
}

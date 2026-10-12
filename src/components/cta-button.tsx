import Link from "next/link";
import type { ReactNode } from "react";
import { MagneticButton } from "@/src/components/magnetic-button";

const CTA_CLASS =
  "glass-button type-action inline-flex items-center gap-3 rounded-full border border-white/55 px-8 py-4 hover:border-white/85";

// The primary glass CTA — a link when given `href`, otherwise a submit button.
export function CtaButton({
  href,
  cursor = "button",
  children,
}: {
  href?: string;
  cursor?: string;
  children: ReactNode;
}) {
  const content = (
    <>
      {children}
      <span aria-hidden>→</span>
    </>
  );

  return (
    <MagneticButton>
      {href ? (
        <Link href={href} data-cursor={cursor} className={CTA_CLASS}>
          {content}
        </Link>
      ) : (
        <button type="submit" data-cursor={cursor} className={CTA_CLASS}>
          {content}
        </button>
      )}
    </MagneticButton>
  );
}

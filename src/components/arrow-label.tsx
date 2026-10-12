import type { ReactNode } from "react";

// Text + arrow for secondary "read more" links. Sits inside an element with
// the `group` class (a card or a link); the arrow nudges on that group's hover.
export function ArrowLabel({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`type-action inline-flex items-center gap-2 text-foreground/70 transition-colors ${className}`}
    >
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </span>
  );
}

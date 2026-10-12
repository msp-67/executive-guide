import type { ReactNode } from "react";
import { AccentMark } from "@/src/components/accent-mark";
import type { Accent } from "@/src/lib/quadrant-accents";

// The uppercase label with a short accent line in front — hero eyebrows,
// section headings and card subtitles all share this one recipe.
export function Eyebrow({
  as: Tag = "p",
  accent = "navy",
  size = "md",
  className = "",
  children,
}: {
  as?: "p" | "h2";
  accent?: Accent;
  size?: "md" | "sm";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={`flex items-start gap-2.5 text-balance ${size === "sm" ? "type-label-sm" : "type-label"} ${className}`}
    >
      {/* Half a line-height down: centered on the first line even when the label wraps. */}
      <AccentMark accent={accent} className="mt-[0.5lh] shrink-0" />
      {children}
    </Tag>
  );
}

import { ACCENT_BG, type Accent } from "@/src/lib/quadrant-accents";

// A small line of palette color dropped in front of eyebrow-style labels —
// the one deliberate touch of color allowed to repeat sitewide, kept tiny
// on purpose so it reads as seasoning, not decoration.
export function AccentMark({
  accent = "navy",
  className = "",
}: {
  accent?: Accent;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block h-px w-4 ${ACCENT_BG[accent]} ${className}`}
    />
  );
}

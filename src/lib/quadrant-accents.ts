import type { Dictionary } from "@/src/dictionaries/get-dictionary";

export type Accent = "navy" | "blue" | "teal" | "green";

export const ACCENT_BG: Record<Accent, string> = {
  navy: "bg-accent-navy",
  blue: "bg-accent-blue",
  teal: "bg-accent-teal",
  green: "bg-accent-green",
};

export const ACCENT_TEXT: Record<Accent, string> = {
  navy: "text-accent-navy",
  blue: "text-accent-blue",
  teal: "text-accent-teal",
  green: "text-accent-green",
};

export const ACCENT_BORDER: Record<Accent, string> = {
  navy: "border-accent-navy/40",
  blue: "border-accent-blue/40",
  teal: "border-accent-teal/40",
  green: "border-accent-green/40",
};

// A thin accent top-edge for item cards — the same "thin colored line" motif
// as AccentMark, just horizontal-on-a-card instead of next to a heading.
// Kept as a single combined idle+hover string since the two always travel together.
export const ACCENT_CARD_EDGE: Record<Accent, string> = {
  navy: "border-t-accent-navy/40 hover:border-t-accent-navy/70",
  blue: "border-t-accent-blue/40 hover:border-t-accent-blue/70",
  teal: "border-t-accent-teal/40 hover:border-t-accent-teal/70",
  green: "border-t-accent-green/40 hover:border-t-accent-green/70",
};

export const QUADRANT_ACCENTS = [
  { key: "individual", slug: "individual", accent: "navy" },
  { key: "teams", slug: "teams", accent: "blue" },
  { key: "mediation", slug: "mediation", accent: "teal" },
  { key: "families", slug: "families", accent: "green" },
] as const satisfies ReadonlyArray<{
  key: keyof Dictionary["quadrants"];
  slug: string;
  accent: Accent;
}>;

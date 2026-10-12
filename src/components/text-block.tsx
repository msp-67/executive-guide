import type { ReactNode } from "react";
import { ACCENT_BORDER, type Accent } from "@/src/lib/quadrant-accents";

// Running text of a section: one or more paragraphs behind a thin accent line.
export function TextBlock({ paragraphs, accent }: { paragraphs: string[]; accent: Accent }) {
  return (
    <div
      data-reveal
      className={`max-w-2xl space-y-4 border-l-2 ${ACCENT_BORDER[accent]} pl-6 text-lg leading-relaxed text-foreground/80`}
    >
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

// Text set apart in a glass panel — paragraphs as its children.
export function Callout({ children }: { children: ReactNode }) {
  return (
    <div
      data-reveal
      className="glass max-w-2xl space-y-4 rounded-panel border border-white/55 p-8 text-lg leading-relaxed text-foreground/80 sm:p-10"
    >
      {children}
    </div>
  );
}

// A quiet line under a section — credentials, languages.
export function Note({ children }: { children: string }) {
  return (
    <p data-reveal className="mt-8 max-w-2xl text-sm text-foreground/50">
      {children}
    </p>
  );
}

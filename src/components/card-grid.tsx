import type { Locale } from "@/src/dictionaries/locales";
import { RichText, type RichTextValue } from "@/src/components/site-link";
import { ACCENT_BG, ACCENT_CARD_EDGE, type Accent } from "@/src/lib/quadrant-accents";

// Items longer than this no longer fit a third-width card comfortably.
const THREE_COLUMN_MAX_LENGTH = 60;

// Where an item's opening term ends: before the dash in "Term — explanation",
// after the full stop in "Term. Explanation."
const LEAD_END: Record<string, (item: string) => number> = {
  dash: (item) => item.indexOf(" — "),
  sentence: (item) => item.indexOf(". ") + 1,
};

// Items that open with a term get it set a weight up; the text itself stays
// exactly as written.
function CardText({ item, lead, lang }: { item: RichTextValue; lead?: string; lang: Locale }) {
  const end = lead && typeof item === "string" ? (LEAD_END[lead]?.(item) ?? 0) : 0;
  if (typeof item === "string" && end > 0) {
    return (
      <>
        <span className="font-medium text-foreground/90">{item.slice(0, end)}</span>
        {item.slice(end)}
      </>
    );
  }
  return <RichText value={item} lang={lang} />;
}

// Shared item-card recipe — used by the service pages and the about page so
// the two never visually drift apart.
export function CardGrid({
  items,
  accent,
  lang,
  lead,
}: {
  items: RichTextValue[];
  accent: Accent;
  lang: Locale;
  // "dash" or "sentence" — see LEAD_END.
  lead?: string;
}) {
  const texts = items.map((item) => (typeof item === "string" ? item : item.text));
  const longest = Math.max(...texts.map((text) => text.length));
  const twoColumns =
    items.length !== 3 && (items.length === 4 || longest > THREE_COLUMN_MAX_LENGTH);

  return (
    <div className={`grid grid-cols-1 gap-4 ${twoColumns ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
      {items.map((item, i) => (
        <div
          key={texts[i]}
          data-reveal
          className={`glass rounded-card border-x border-b border-t-2 border-x-white/55 border-b-white/55 ${ACCENT_CARD_EDGE[accent]} p-5 transition-colors hover:border-x-white/85 hover:border-b-white/85`}
        >
          <span aria-hidden className={`block h-1.5 w-1.5 rounded-full ${ACCENT_BG[accent]}`} />
          <p className="mt-4 text-foreground/80">
            <CardText item={item} lead={lead} lang={lang} />
          </p>
        </div>
      ))}
    </div>
  );
}

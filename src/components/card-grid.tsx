import { ACCENT_BG, ACCENT_CARD_EDGE, type Accent } from "@/src/lib/quadrant-accents";

export type CardItem = string | { title: string; detail?: string };

// Shared item-card recipe — used by both PremiumSubpage (service pages) and
// SubpageContent (about page) so the two never visually drift apart.
export function CardGrid({ items, accent }: { items: CardItem[]; accent: Accent }) {
  const cols = items.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-4 ${cols}`}>
      {items.map((item) => {
        const isCard = typeof item !== "string";
        return (
          <div
            key={isCard ? item.title : item}
            className={`section-item subpage-section-item glass rounded-xl border-x border-b border-t-2 border-x-white/55 border-b-white/55 ${ACCENT_CARD_EDGE[accent]} p-5 transition-colors duration-300 ease-hover hover:border-x-white/85 hover:border-b-white/85`}
          >
            <span
              aria-hidden
              className={`block h-1.5 w-1.5 rounded-full ${ACCENT_BG[accent]}`}
            />
            {isCard ? (
              <>
                <p className="mt-4 text-[0.95rem] font-medium text-foreground/90">
                  {item.title}
                </p>
                {item.detail && (
                  <p className="mt-1 text-sm text-foreground/55">{item.detail}</p>
                )}
              </>
            ) : (
              <p className="mt-4 text-[0.95rem] text-foreground/80">{item}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { ACCENT_BG, ACCENT_CARD_EDGE, type Accent } from "@/src/lib/quadrant-accents";

export type CardItem = string | { title: string; detail?: string };

// Shared item-card recipe — used by both PremiumSubpage (service pages) and
// SubpageContent (about page) so the two never visually drift apart.
// `elevated` adds a deeper resting shadow + hover lift, opt-in per call site
// so existing pages keep their current (flatter) look until asked for.
export function CardGrid({
  items,
  accent,
  elevated = false,
}: {
  items: CardItem[];
  accent: Accent;
  elevated?: boolean;
}) {
  const cols = items.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-4 ${cols}`}>
      {items.map((item) => {
        const isCard = typeof item !== "string";
        return (
          <div
            key={isCard ? item.title : item}
            className={`section-item subpage-section-item glass rounded-xl border-x border-b border-t-2 border-x-white/55 border-b-white/55 ${ACCENT_CARD_EDGE[accent]} p-5 duration-300 ease-hover hover:border-x-white/85 hover:border-b-white/85 ${
              elevated
                ? "shadow-[0_18px_45px_-20px_rgba(20,20,15,0.22)] transition-[color,border-color,transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_24px_55px_-18px_rgba(20,20,15,0.28)]"
                : "transition-colors"
            }`}
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

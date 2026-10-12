import { ACCENT_TEXT, type Accent } from "@/src/lib/quadrant-accents";

export function NumberedSteps({ items, accent }: { items: string[]; accent: Accent }) {
  return (
    <div className="max-w-2xl space-y-10">
      {items.map((item, i) => (
        <div key={item} data-reveal className="flex items-start gap-5 sm:gap-7">
          <span
            aria-hidden
            className={`select-none font-serif text-5xl font-bold leading-none sm:text-6xl ${ACCENT_TEXT[accent]} opacity-25`}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="pt-1 text-lg text-foreground/80 sm:pt-2">{item}</p>
        </div>
      ))}
    </div>
  );
}

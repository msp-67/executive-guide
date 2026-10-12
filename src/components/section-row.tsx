import type { ReactNode } from "react";
import { Eyebrow } from "@/src/components/eyebrow";
import type { Accent } from "@/src/lib/quadrant-accents";

// One content section on a subpage: the label in the left columns, the content
// in the right — the same left edges on every section and page. Stacks below
// `lg`, where the label column would squeeze the content. The label is the
// section's heading unless the content carries its own (`labelAs="p"`); a
// section with no label keeps the left columns empty.
export function SectionRow({
  label,
  labelAs = "h2",
  accent,
  id,
  children,
}: {
  label?: string;
  labelAs?: "h2" | "p";
  accent: Accent;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-reveal-section
      className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-8"
    >
      {label && (
        <div className="lg:col-span-3">
          <div data-reveal>
            <Eyebrow as={labelAs} accent={accent}>
              {label}
            </Eyebrow>
          </div>
        </div>
      )}
      <div className="lg:col-span-9 lg:col-start-4">{children}</div>
    </section>
  );
}

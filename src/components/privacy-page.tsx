import { getDictionary } from "@/src/dictionaries/get-dictionary";
import type { Locale } from "@/src/dictionaries/locales";

// Each paragraph of the policy opens with what it is about — "Controller:",
// "Do you have to provide your data?" — which is set a weight up as its heading.
const LEAD = /^(.+?[:?])(\s[\s\S]*)$/;

// The privacy policy: plain text, no cards or motion. Served at a translated
// address per language (app/[lang]/osobni-udaje and app/[lang]/privacy).
export async function PrivacyPage({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const page = dict.pages.privacy;

  return (
    <article className="container-page pb-section pt-hero">
      <h1 className="type-statement max-w-4xl">{page.title}</h1>
      <div className="mt-12 max-w-2xl space-y-6 text-lg leading-relaxed text-foreground/80">
        {page.paragraphs.map((paragraph) => {
          const lead = paragraph.match(LEAD);
          return (
            <p key={paragraph}>
              {lead ? (
                <>
                  <strong className="font-medium text-foreground">{lead[1]}</strong>
                  {lead[2]}
                </>
              ) : (
                paragraph
              )}
            </p>
          );
        })}
      </div>
    </article>
  );
}

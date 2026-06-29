@AGENTS.md

# Executive Guide — pravidla a styl webu

Trvalá paměť pravidel a stylu pro tenhle web. Přečti si to na začátku každé session, než začneš měnit kód.

## Projekt

- Bilingvní (CZ/EN) prémiový web pro Jana Spáčila — Executive Guide. Advokát, mediátor, kouč pro top management a vlastníky firem.
- Cílovka: vlastníci firem, vrcholový management — klienti přicházejí přes doporučení.
- Web musí působit vážně, diskrétně a draze — jako produkt za stovky tisíc, ne jako startup landing page.

## Stack

- Next.js App Router, TypeScript, Tailwind.
- Animace: GSAP + `@gsap/react` + ScrollTrigger, Lenis (smooth scroll napojený na `gsap.ticker`, viz `src/components/smooth-scroll.tsx`), Framer Motion, React Three Fiber kde je to potřeba.
- i18n bez knihovny: dynamický segment `[lang]` (`cs`/`en`), dictionaries v `src/dictionaries/`, helper `getDictionary()`. Default redirect `/` → `/cs` přes `next.config.ts`.
- Easing křivky žijí na jednom místě v `src/lib/easing.ts` (zaregistrované i jako GSAP `CustomEase` v `src/lib/gsap.ts`). VŽDY je používej odtud — nikdy defaultní/lineární easing přímo v komponentě.
- Design tokeny (barvy, fonty) žijí v `app/globals.css` (`@theme inline`). Akcentní paleta je sdílená přes `src/lib/quadrant-accents.ts`.

## Design principy (důležité — drž je u každé změny)

- Estetika: minimalistická, vážná, švýcarská typografická škola.
- Světlý režim: off-white pozadí, tmavý text. Modrozelená akcentní paleta (navy, modrá, teal, zelená) — decentní, nikdy křiklavá ani pastelová.
- Typografie: nadpisy Hanken Grotesk (švýcarský grotesk), body text Inter. Žádné hravé ani dekorativní fonty.
- Méně je víc. Zdrženlivost před efektností — u téhle cílovky dělá drahý dojem klid a preciznost, ne množství efektů. Když si nejsi jistý, ubírej.

## Animace

- Plynulé, klidné, elegantní. Pomalejší easing (power3.out a podobné, vždy z `src/lib/easing.ts`), jemný stagger. Žádné agresivní, rychlé ani křiklavé efekty.
- Scroll-driven přes Lenis + ScrollTrigger. Scrub s mírným zpožděním (ne 1:1 skok s kolečkem), ať je plynulé i při rychlém scrollu.
- VŽDY respektuj `prefers-reduced-motion` — statická, plně funkční varianta beze ztráty obsahu.
- Drž 60fps — animuj jen `transform`/`opacity`/`filter`, `will-change` uvážlivě (jen kde se opravdu kontinuálně animuje).

## Responzivita a kvalita

- Vždy plně responzivní. Po každé větší změně ověř na mobilní šířce, že nic nepřetéká a není horizontální scroll.
- Po každé změně ověř `npm run build` a `npm run lint`.
- České háčky a čárky musí sedět ve všech fontech, váhách a velikostech (i v bold/display řezech).

## Pracovní styl

- Nedělej ortogonální změny — měň jen to, o co jde, nesahej na nesouvisející kód.
- Nenafukuj jednoduché řešení. Preferuj nejjednodušší robustní variantu.
- Když narazíš na technický problém nebo nejednoznačnost, řekni to a navrhni řešení — neřeš to potichu špatným předpokladem.
- Změny barev, fontů a easingu drž na jednom místě (design tokeny / config), ať se propisují konzistentně do celého webu.

import type { Dictionary } from "@/src/dictionaries/get-dictionary";
import type { RouteKey } from "@/src/lib/routes";

// The main menu, in order. Each key names both the page (see routes.ts) and
// its label in the dictionary's `nav`.
export const navItems = [
  "individual",
  "teams",
  "mediation",
  "families",
  "how",
  "about",
  "contact",
] as const satisfies ReadonlyArray<RouteKey & keyof Dictionary["nav"]>;

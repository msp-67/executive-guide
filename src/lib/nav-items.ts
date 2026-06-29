import type { Dictionary } from "@/src/dictionaries/get-dictionary";

export const navItems = [
  { slug: "individual", key: "individual" },
  { slug: "teams", key: "teams" },
  { slug: "mediation", key: "mediation" },
  { slug: "families", key: "families" },
  { slug: "about", key: "about" },
  { slug: "contact", key: "contact" },
] as const satisfies ReadonlyArray<{ slug: string; key: keyof Dictionary["nav"] }>;

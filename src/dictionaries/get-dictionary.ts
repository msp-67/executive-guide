import type { Locale } from "./locales";
import cs from "./cs.json";

const dictionaries = {
  cs: () => import("./cs.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
};

export type Dictionary = typeof cs;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

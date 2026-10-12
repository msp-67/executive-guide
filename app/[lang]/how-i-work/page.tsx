import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/src/lib/metadata";
import { HowPage } from "@/src/components/how-page";

// This address exists in one language only; the other one is /cs/jak-pracuji.
const LANG = "en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return lang === LANG ? pageMetadata(lang, "how") : {};
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== LANG) notFound();

  return <HowPage lang={LANG} />;
}

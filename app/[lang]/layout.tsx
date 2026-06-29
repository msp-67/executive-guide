import { notFound } from "next/navigation";
import { getDictionary } from "@/src/dictionaries/get-dictionary";
import { locales, isLocale } from "@/src/dictionaries/locales";
import { Header } from "@/src/components/header";
import { Footer } from "@/src/components/footer";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <Header lang={lang} nav={dict.nav} />
      <main className="flex-1 pt-24">{children}</main>
      <Footer lang={lang} nav={dict.nav} />
    </>
  );
}

import type { Metadata } from "next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import { SmoothScroll } from "@/src/components/smooth-scroll";
import { Cursor } from "@/src/components/cursor";
import { AmbientBackground } from "@/src/components/ambient-background";
import { defaultLocale } from "@/src/dictionaries/locales";
import "./globals.css";

const displayFont = Hanken_Grotesk({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Executive Guide — Jan Spáčil",
  description: "Executive Guide — průvodce pro vrcholový management a majitele firem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLocale}
      className={`${displayFont.variable} ${inter.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
        <AmbientBackground />
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}

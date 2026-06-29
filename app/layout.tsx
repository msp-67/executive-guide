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
  icons: {
    // Setting `icons` explicitly opts out of Next's file-convention
    // auto-detection (app/icon.svg, app/apple-icon.png), so every variant
    // is listed here by hand instead. icon.svg (self-adapting via an
    // embedded prefers-color-scheme media query) is what modern browsers
    // use; the PNGs are the fallback for contexts that don't evaluate the
    // SVG's internal media query.
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicons/icon-light-16.png", media: "(prefers-color-scheme: light)", sizes: "16x16", type: "image/png" },
      { url: "/favicons/icon-light-32.png", media: "(prefers-color-scheme: light)", sizes: "32x32", type: "image/png" },
      { url: "/favicons/icon-dark-16.png", media: "(prefers-color-scheme: dark)", sizes: "16x16", type: "image/png" },
      { url: "/favicons/icon-dark-32.png", media: "(prefers-color-scheme: dark)", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
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

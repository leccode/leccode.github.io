import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { CommandPalette } from "@/components/command-palette";
import { Footer } from "@/components/contact";
import { Nav } from "@/components/nav";
import { ThemeProvider, ThemeScript } from "@/components/theme-provider";
import { CursorGlow, ScrollProgress } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { getAllArticles } from "@/lib/articles";
import "./globals.css";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const defaultTitle = `${site.name} · ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/articles/rss.xml" },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: defaultTitle,
    description: site.description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0a10" },
    { media: "(prefers-color-scheme: light)", color: "#fbfaff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${sans.variable} ${mono.variable} ${serif.variable}`}
      style={{ colorScheme: "dark" }}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-200"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <ScrollProgress />
          <CursorGlow />
          <div
            aria-hidden
            className="noise pointer-events-none fixed inset-0 z-70"
          />
          <Nav />
          <CommandPalette
            articles={getAllArticles().map(({ slug, title }) => ({
              slug,
              title,
            }))}
          />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

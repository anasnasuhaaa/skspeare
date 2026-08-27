import type { Metadata } from "next";
import { Space_Grotesk, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import TabTitleEffect from "./components/TabTitleEffect";

export const metadata: Metadata = {
  title: "Proxy Shakespeare | Pekan Ilkomerz 62",
  description:
    "Official profile website for Proxy Shakespeare — Pekan Ilkomerz 62, Department of Computer Science, IPB University.",
  keywords: [
    "Proxy Shakespeare",
    "Pekan Ilkomerz 62",
    "Ilkomerz 62",
    "Computer Science IPB",
    "IPB University",
  ],
  authors: [{ name: "Proxy Shakespeare Team" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Proxy Shakespeare | Pekan Ilkomerz 62",
    description:
      "Official profile website for Proxy Shakespeare — Pekan Ilkomerz 62, Department of Computer Science, IPB University.",
    type: "website",
    locale: "en_US",
    siteName: "Proxy Shakespeare",
  },
  twitter: {
    card: "summary_large_image",
    title: "Proxy Shakespeare | Pekan Ilkomerz 62",
    description:
      "Official profile website for Proxy Shakespeare — Pekan Ilkomerz 62, Department of Computer Science, IPB University.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Dynamic Tab Title Effect when tab is inactive */}
        <TabTitleEffect />
        {children}
        {/* Spotify iFrame API — loaded once, used by all member modals */}
        <Script
          src="https://open.spotify.com/embed/iframe-api/v1"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

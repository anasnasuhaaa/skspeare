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

export const metadata: Metadata = {
  title: "Proxy Shakespeare | Pekan Ilkomerz 62",
  description:
    "Group profile website for Proxy Shakespeare — Pekan Ilkomerz 62, Program Studi Ilmu Komputer, IPB University.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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

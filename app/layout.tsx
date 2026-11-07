import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import "./home.css";
import "./pages.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400"],
});

// Bodoni's high-contrast italic, at display optical size, for highlighted words in headlines.
const bodoniModa = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  style: "italic",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  // WhatsApp/Facebook need absolute URLs for og:image; app/opengraph-image.png is picked up automatically.
  metadataBase: new URL("https://madoonna.com"),
  // No og:title/description here: subpages would inherit the homepage's. Scrapers fall back to <title>.
  openGraph: { siteName: "Madò Onnà", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  // Search Console "HTML tag" verification; leave unset if verified via DNS.
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  title: "Madò Onnà · Mediterranean restaurant, dinner show & club in Berawa, Canggu",
  description:
    "A Mediterranean restaurant, a dinner show, three bars, VIP tables and a club under one roof in Berawa, Canggu, Bali. Come for dinner, stay for the show.",
  icons: { icon: "/assets/favicon-32.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${bodoniModa.variable}`}>
      <body>{children}</body>
    </html>
  );
}

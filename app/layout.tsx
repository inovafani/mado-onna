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
  title: "Madò Onnà · Mediterranean restaurant, show dinner & club in Berawa, Bali",
  description:
    "One address in Berawa, Bali holds a Mediterranean restaurant, a stage, three bars and a club. Come for dinner, stay for the show.",
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

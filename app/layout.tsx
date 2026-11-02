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

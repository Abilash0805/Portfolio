import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

/**
 * The deployed origin. Set NEXT_PUBLIC_SITE_URL once the domain is known;
 * on Vercel it is inferred automatically. Deliberately NOT a guessed domain —
 * a wrong metadataBase silently poisons every canonical and OG URL, and a
 * localhost fallback is at least obviously wrong rather than plausibly wrong.
 */
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Abilash V — Developer, Designer, Founder",
    template: "%s — Abilash V",
  },
  description:
    "Class 12 student running Orixen Digital, building StudyDesk, and shipping robotics under competition deadlines. Web, hardware and creative work.",
  keywords: [
    "Abilash V",
    "Orixen Digital",
    "StudyDesk",
    "web developer",
    "video editor",
    "Arduino",
    "ESP32",
    "robotics",
    "portfolio",
  ],
  authors: [{ name: "Abilash V" }],
  creator: "Abilash V",
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Abilash V",
    title: "Abilash V — Developer, Designer, Founder",
    description:
      "Runs Orixen Digital. Builds StudyDesk. Ships robotics under competition deadlines.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abilash V — Developer, Designer, Founder",
    description:
      "Runs Orixen Digital. Builds StudyDesk. Ships robotics under competition deadlines.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05070e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

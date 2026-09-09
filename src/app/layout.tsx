import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Width axis is loaded deliberately: display type narrows as it scales up.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const SITE = "https://abilash.dev";

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
  themeColor: "#0a0c10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

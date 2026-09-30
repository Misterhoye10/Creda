import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Script from "next/script";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Creda — Proof-of-Work Skill Passport for African Tech Talent",
    template: "%s | Creda",
  },
  description:
    "Creda analyzes your GitHub code, commits, and CVs to issue a cryptographically verifiable Skill Passport. Prove what you can actually do — free, in 60 seconds.",
  keywords: [
    "skills verification",
    "skill passport",
    "proof of work",
    "tech talent Africa",
    "developer portfolio",
    "GitHub analysis",
    "cryptographic verification",
    "job matching",
  ],
  openGraph: {
    title: "Creda — Proof-of-Work Skill Passport",
    description:
      "Prove what you can actually do. AI-powered skill verification for African tech professionals.",
    type: "website",
    locale: "en_US",
    siteName: "Creda",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creda — Proof-of-Work Skill Passport",
    description:
      "Prove what you can actually do. AI-powered skill verification for African tech professionals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          src="/suppress-extensions.js"
          strategy="beforeInteractive"
        />
        {/* Instrument Serif loaded via Google Fonts link — not available in next/font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

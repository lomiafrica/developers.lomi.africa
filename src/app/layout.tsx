import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/lib/contexts/auth-context";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://developers.lomi.africa"),
  title: {
    default: "lomi. | Developers documentation",
    template: "%s | lomi. | Developers documentation",
  },
  description:
    "Documentation website of lomi. - The open source payment orchestration platform powering West-African businesses",
  keywords: [
    "lomi",
    "payment orchestration",
    "west africa",
    "payment api",
    "payment gateway",
    "developer documentation",
    "api documentation",
    "fintech",
    "african payments",
  ],
  authors: [{ name: "lomi.", url: "https://lomi.africa" }],
  creator: "lomi.",
  publisher: "lomi.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://developers.lomi.africa",
    title: "lomi. | Developer documentation",
    description:
      "Documentation website of lomi. - The open source payment orchestration platform powering West-African businesses",
    siteName: "lomi. | Developer documentation",
    images: [
      {
        url: "https://developers.lomi.africa/banner.webp",
        width: 1200,
        height: 630,
        alt: "lomi. Documentation",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "lomi. | Developer documentation",
    description:
      "Documentation website of lomi. - The open source payment orchestration platform powering West-African businesses",
    images: ["https://developers.lomi.africa/banner.webp"],
    creator: "@lomiafrica",
    site: "@lomiafrica",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        href: "/favicon.ico",
        sizes: "any",
      },
    ],
    apple: [
      {
        url: "/favicon.ico",
        sizes: "180x180",
        type: "image/x-icon",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.ico",
      },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google:
      "google-site-verification=fD_UOOSaZDjO5rdngNSUYtYQK-sfA5DhMyiUNW7GyAs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

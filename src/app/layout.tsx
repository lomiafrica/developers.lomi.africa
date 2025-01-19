import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Analytics } from "@vercel/analytics/react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://developers.lomi.africa'),
  title: {
    default: "lomi. | Developers Documentation",
    template: "%s | lomi. | Developers docs"
  },
  description: "Documentation website for the lomi. API - The open source payment orchestration platform powering West-African businesses",
  keywords: [""],
  authors: [{ name: "lomi." }],
  creator: "lomi.",
  publisher: "lomi.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://developers.lomi.africa',
    title: 'lomi. | Developer Documentation',
    description: "Documentation website for the lomi. API - The open source payment orchestration platform powering West-African businesses",
    siteName: 'lomi. | Developer Documentation',
    images: [{
      url: '/lomi-icon.png',
      width: 1200,
      height: 630,
      alt: 'lomi. Documentation'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'lomi. | Developer Documentation',
    description: "Documentation website for the lomi. API - The open source payment orchestration platform powering West-African businesses",
    images: ['/lomi-icon.png'],
    creator: '@lomi',
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
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.ico",
      },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

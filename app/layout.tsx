import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "one eyed kings",
  description: "oneeyed.tokyo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta property="og:title" content="one eyed kings" />
        <meta property="og:description" content="oneeyed.tokyo" />
        <meta property="og:image" content="/media/homepage.mp4" />
        <meta property="og:url" content="https://oneeyed.tokyo" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen bg-[#0a0a0a]">{children}</body>
    </html>
  );
}

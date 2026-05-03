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
  openGraph: {
    title: "one eyed kings",
    description: "oneeyed.tokyo",
    url: "https://oneeyed.tokyo",
  },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
<body className="min-h-screen bg-[#0a0a0a]">{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import PwaRegister from "@/components/PwaRegister";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "StreamArena — Live TV & Sports",
  description:
    "Watch live TV channels, sports, World Cup 2026, news and entertainment online for free.",
  keywords: ["IPTV", "live TV", "World Cup 2026", "sports streaming", "Bangladesh TV"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StreamArena",
  },
  openGraph: {
    title: "StreamArena — Live TV & Sports",
    description: "Watch 200+ live channels including World Cup 2026",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#e50914",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-5197585000953461" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5197585000953461"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="bg-[#0d0d0f] text-white antialiased">
        <PwaRegister />
        <Navbar />
        <main className="pt-16 min-h-screen">{children}</main>
        <footer className="border-t border-[#2a2a35] py-8 text-center text-sm text-gray-500 mt-16">
          <p>© 2026 StreamArena. All rights reserved.</p>
          <p className="mt-1 text-xs">
            For entertainment purposes only. Stream quality depends on your connection.
          </p>
        </footer>
      </body>
    </html>
  );
}

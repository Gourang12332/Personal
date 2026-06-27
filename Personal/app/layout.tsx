import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import SparkleCursor from "@/components/SparkleCursor";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Shejal's Universe - Happy Birthday ❤️",
  description: "An extraordinary, premium birthday surprise crafted for Shejal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-pink-100 font-sans">
        {/* Fullscreen mouse trailing particle sparkles */}
        <SparkleCursor />
        {children}
      </body>
    </html>
  );
}

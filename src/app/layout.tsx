import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";

import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"]
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "EventFlow",
  description: "A local-first event management system demo."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}

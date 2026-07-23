import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";

import { SiteHeader } from "@/components/SiteHeader";
import { ToastProvider } from "@/components/ToastProvider";

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
      <body>
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <footer className="border-t border-border bg-background">
              <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 sm:px-10 lg:px-16">
                <p className="font-display text-2xl leading-none">EventFlow</p>
                <p className="text-sm text-muted-foreground">
                  A local-first event management system demo.
                </p>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}

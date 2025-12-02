import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/locale";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BeamsBackgroundWrapper from "@/components/BeamsBackgroundWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rita Mahlis - Journalismus & Online-Unterricht",
  description: "Journalismus, Artikel und Online-Kurse von Rita Mahlis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@700&family=Antic&family=Cairo:wght@400;600;700;900&display=swap"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <BeamsBackgroundWrapper />
        <LocaleProvider>
          <Header />
          <div className="relative z-10">
            {children}
          </div>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}

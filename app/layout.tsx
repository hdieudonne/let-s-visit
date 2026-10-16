import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Let's Visit | Shared Road Trips & Adventures",
  description: "Discover curated destinations, organize carpools, and embark on unforgettable group adventures.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#EFF1F3] text-[#223843] selection:bg-[#D97760] selection:text-white">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-[#D8CDD2] bg-[#EFF1F3] py-8 text-center text-sm text-[#52646B]">
          © {new Date().getFullYear()} Let&apos;s Visit. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
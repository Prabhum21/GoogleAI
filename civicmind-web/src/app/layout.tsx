import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import { RegionProvider } from "@/context/RegionContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CivicMind AI",
  description: "AI-Powered Decision Intelligence Platform for Better Living and Smarter Communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RegionProvider>
          <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {children}
              </main>
            </div>
          </div>
        </RegionProvider>
      </body>
    </html>
  );
}

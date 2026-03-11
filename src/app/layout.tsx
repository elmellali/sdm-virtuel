import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers";

import Chatbot from "@/components/public/Chatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SDM virtuel - Le salon des leaders BTP au Maroc",
  description: "Plateforme d'exposition virtuelle BTP au Maroc. Découvrez les promoteurs, promoteurs et leurs projets en 360°.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <Providers>
          <div className="app-container">
            {children}
            <Chatbot />
          </div>
        </Providers>
      </body>
    </html>
  );
}

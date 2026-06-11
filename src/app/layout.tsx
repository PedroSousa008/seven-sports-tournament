import type { Metadata } from "next";
import { TOURNAMENT } from "@/lib/constants";
import { Bebas_Neue, Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `Torneio 5 Desportos Braga | ${TOURNAMENT.dateRange}`,
  description:
    "O maior torneio multidesportivo de Braga. 12 equipas, 4 desportos, 1 campeão. Futebol 7 (10 Jul), Padel (11 Jul), Voleibol (17 Jul) e Karts (18 Jul).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} ${bebas.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

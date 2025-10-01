import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import React from "react";
import LayoutContent from "@/components/layoutContent";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "ShopSphere",
    template: "%s | ShopSphere",
  },
  description:
    "A modern, fully responsive e-commerce website designed to provide a seamless shopping experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-secondary text-primary`}>
        <AppProviders>
          <LayoutContent>{children}</LayoutContent>
        </AppProviders>
      </body>
    </html>
  );
}

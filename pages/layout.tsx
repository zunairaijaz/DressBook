import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AppProviders } from './providers';
// FIX: Import React to resolve type errors for React.ReactNode.
import React from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'ShopSphere',
    template: '%s | ShopSphere',
  },
  description: 'A modern, fully responsive e-commerce website designed to provide a seamless shopping experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-secondary text-primary`}>
        {/* FIX: Explicitly pass children to AppProviders to resolve TypeScript error about missing property. */}
        <AppProviders children={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        } />
      </body>
    </html>
  )
}

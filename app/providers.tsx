'use client';

import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
// FIX: Import React to resolve type errors for React.ReactNode.
import React from 'react';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
            {children}
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
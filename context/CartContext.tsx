import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { CartItem } from '../types';
import {
  getCartAPI,
  addToCartAPI,
  updateCartItemAPI,
  removeFromCartAPI
} from '../lib/cart';

interface CartContextProps {
  items: CartItem[];
  loading: boolean;
  addItem: (product: { id: string; selectedVariant?: string }, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  cartCount: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const cartItems = await getCartAPI();
        setItems(cartItems);
      } catch (error) {
        console.error("Failed to fetch cart", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const addItem = useCallback(async (product: { id: string; selectedVariant?: string }, quantity: number) => {
    try {
      const updatedCart = await addToCartAPI(product, quantity);
      setItems(updatedCart);
    } catch (error) {
      console.error("Failed to add item to cart", error);
    }
  }, []);

  const removeItem = useCallback(async (id: string) => {
    try {
      const updatedCart = await removeFromCartAPI(id);
      setItems(updatedCart);
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  }, []);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    try {
      const updatedCart = await updateCartItemAPI(id, quantity);
      setItems(updatedCart);
    } catch (error) {
      console.error("Failed to update item quantity", error);
    }
  }, []);

  const cartCount = items.reduce((count, item) => count + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addItem, removeItem, updateQuantity, cartCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

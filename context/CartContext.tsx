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
  addItem: (product: { id: string; selectedVariant?: Record<string, string> }, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  cartCount: number;
  totalPrice: number;
    clearCart: () => Promise<void>;

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
        const cartItems: CartItem[] = await getCartAPI();
        setItems(cartItems);
      } catch (error) {
        console.error("Failed to fetch cart", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Add item to cart
  const addItem = useCallback(
    async (product: { id: string; selectedVariant?: Record<string, string> }, quantity: number) => {
      try {
        // Ensure selectedVariant is always an object
        const payload: { id: string; selectedVariant?: Record<string, string> } = {
          id: product.id,
          selectedVariant: product.selectedVariant || {}
        };
        const updatedCart: CartItem[] = await addToCartAPI(payload, quantity);
        setItems(updatedCart);
      } catch (error) {
        console.error("Failed to add item to cart", error);
      }
    },
    []
  );

  // Remove item from cart
  const removeItem = useCallback(async (id: string) => {
    try {
      const updatedCart: CartItem[] = await removeFromCartAPI(id);
      setItems(updatedCart);
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  }, []);

  // Update item quantity
  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    try {
      const updatedCart: CartItem[] = await updateCartItemAPI(id, quantity);
      setItems(updatedCart);
    } catch (error) {
      console.error("Failed to update item quantity", error);
    }
  }, []);
const clearCart = useCallback(async () => {
  try {
    const res = await fetch('/api/cart/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: "YOUR_LOGGED_IN_USER_ID" }), // send userId
    });

    const data = await res.json(); // now this won't fail
    if (data.success) {
      setItems([]);
    } else {
      console.error("Failed to clear cart:", data.message);
    }
  } catch (error) {
    console.error("Failed to clear cart", error);
  }
}, []);

  const cartCount = items.reduce((count, item) => count + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + (item.product?.price || item.price || 0) * item.quantity,
    0
  );
// Add this inside your CartProvider component



  return (
<CartContext.Provider value={{
  items,
  loading,
  addItem,
  removeItem,
  updateQuantity,
  cartCount,
  totalPrice,
  clearCart,
}}>
  {children}
</CartContext.Provider>

  );
};

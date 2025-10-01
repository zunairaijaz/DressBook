// lib/cart.ts
import { CartItem } from '../types';

const API_BASE = '/api/cart';

// Get all cart items
export const getCartAPI = async (): Promise<CartItem[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);
  return res.json();
};

// Add item to cart
export const addToCartAPI = async (
  product: Omit<CartItem, 'quantity'>,
  quantity: number
): Promise<CartItem[]> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product, quantity }),
  });
  if (!res.ok) throw new Error(`Failed to add to cart: ${res.status}`);
  return res.json();
};

// Update cart item quantity
export const updateCartItemAPI = async (
  id: string,
  quantity: number
): Promise<CartItem[]> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error(`Failed to update cart item: ${res.status}`);
  return getCartAPI(); // fetch updated cart
};

// Remove cart item
export const removeFromCartAPI = async (id: string): Promise<CartItem[]> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to remove cart item: ${res.status}`);
  return getCartAPI(); // fetch updated cart
};

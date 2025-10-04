import { CartItem, User } from "../types";

const API_BASE = "/api/cart";

// Get or create a persistent guest ID
const getGuestId = (): string => {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

// Helper to get current user ID (logged-in or guest)
const getCurrentUserId = (): string => {
  try {
    const storedUser = sessionStorage.getItem("shopsphere_user");
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      return user.id;
    }
  } catch (err) {
    console.error("Failed to parse user from sessionStorage", err);
  }
  return getGuestId(); // fallback to guest
};

// Get all cart items
export const getCartAPI = async (): Promise<CartItem[]> => {
  const userId = getCurrentUserId();
  const res = await fetch(`${API_BASE}?userId=${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch cart: ${res.status}`);
  return res.json();
};

// Add item to cart
export const addToCartAPI = async (
  product: { id: string; selectedVariant?: Record<string, string> },
  quantity: number
): Promise<CartItem[]> => {
  const userId = getCurrentUserId();

  // Convert selectedVariant object to JSON string for backend
  const payload = {
    product: { id: product.id, selectedVariant: product.selectedVariant ? JSON.stringify(product.selectedVariant) : null },
    quantity,
    userId,
  };

  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Failed to add to cart: ${res.status}`);
  return res.json();
};

// Update cart item quantity
export const updateCartItemAPI = async (id: string, quantity: number): Promise<CartItem[]> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error(`Failed to update cart item: ${res.status}`);
  return getCartAPI();
};

// Remove cart item
export const removeFromCartAPI = async (id: string): Promise<CartItem[]> => {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to remove cart item: ${res.status}`);
  return getCartAPI();
};

export default {
  getCartAPI,
  addToCartAPI,
  updateCartItemAPI,
  removeFromCartAPI,
};

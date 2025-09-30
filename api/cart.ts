import { CartItem } from '../types';

const SIMULATED_DELAY = 200; // ms
const CART_STORAGE_KEY = 'cart';

// --- Helper Functions ---
const getCartFromStorage = (): CartItem[] => {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    } catch (e) {
        return [];
    }
};

const saveCartToStorage = (cart: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};


// --- Simulated API Functions ---

/**
 * Simulates GET /api/cart
 */
export const getCartAPI = (): Promise<CartItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const cart = getCartFromStorage();
            resolve(cart);
        }, SIMULATED_DELAY);
    });
};

/**
 * Simulates POST /api/cart
 */
export const addToCartAPI = (item: Omit<CartItem, 'quantity'>, quantity: number): Promise<CartItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const cart = getCartFromStorage();
            const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                cart.push({ ...item, quantity });
            }

            saveCartToStorage(cart);
            resolve(cart);
        }, SIMULATED_DELAY);
    });
};

/**
 * Simulates PUT /api/cart/:id
 */
export const updateCartItemAPI = (id: number, quantity: number): Promise<CartItem[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (quantity <= 0) {
                resolve(removeFromCartAPI(id));
                return;
            }
            
            let cart = getCartFromStorage();
            const itemIndex = cart.findIndex(cartItem => cartItem.id === id);

            if (itemIndex > -1) {
                cart[itemIndex].quantity = quantity;
                saveCartToStorage(cart);
                resolve(cart);
            } else {
                reject(new Error("Item not found in cart."));
            }
        }, SIMULATED_DELAY);
    });
};


/**
 * Simulates DELETE /api/cart/:id
 */
export const removeFromCartAPI = (id: number): Promise<CartItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let cart = getCartFromStorage();
            cart = cart.filter(item => item.id !== id);
            saveCartToStorage(cart);
            resolve(cart);
        }, SIMULATED_DELAY);
    });
};

/**
 * Simulates POST /api/cart/clear
 */
export const clearCartAPI = (): Promise<CartItem[]> => {
     return new Promise((resolve) => {
        setTimeout(() => {
            saveCartToStorage([]);
            resolve([]);
        }, SIMULATED_DELAY);
    });
}
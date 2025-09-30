import React, { createContext, useReducer, ReactNode, useEffect } from 'react';

type WishlistState = {
  wishlist: number[]; // Array of product IDs
};

type WishlistAction =
  | { type: 'TOGGLE_WISHLIST'; payload: { id: number } }
  | { type: 'SET_WISHLIST'; payload: number[] };

const initialState: WishlistState = {
  wishlist: [],
};

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'TOGGLE_WISHLIST':
      const { id } = action.payload;
      const isInWishlist = state.wishlist.includes(id);
      if (isInWishlist) {
        return {
          ...state,
          wishlist: state.wishlist.filter(productId => productId !== id),
        };
      } else {
        return {
          ...state,
          wishlist: [...state.wishlist, id],
        };
      }
    case 'SET_WISHLIST':
      return {
        ...state,
        wishlist: action.payload,
      };
    default:
      return state;
  }
};

interface WishlistContextProps extends WishlistState {
  toggleWishlist: (id: number) => void;
}

export const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState, (initial) => {
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      return storedWishlist ? { wishlist: JSON.parse(storedWishlist) } : initial;
    } catch (error) {
      console.error("Could not parse wishlist from localStorage", error);
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  const toggleWishlist = (id: number) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: { id } });
  };

  return (
    <WishlistContext.Provider value={{ wishlist: state.wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

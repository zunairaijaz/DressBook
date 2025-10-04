// hooks/useWishlist.ts
import { useState } from 'react';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]); // string[] for product IDs

  const toggleWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(i => i !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  return { wishlist, toggleWishlist };
}

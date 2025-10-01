import React, { useState } from 'react';
// FIX: Using namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Product } from '../types';

const { Link } = ReactRouterDOM;

const WishlistPage: React.FC = () => {
  const { wishlist } = useWishlist();
  const wishlistItems = products.filter(product => wishlist.includes(product.id));
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-xl text-gray-500">Your wishlist is empty.</p>
            <p className="mt-2 text-gray-500">Add items you love to your wishlist to save them for later.</p>
            <Link
              to="/search"
              className="mt-6 inline-block bg-accent border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-accent-hover"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {wishlistItems.map(product => (
              <ProductCard key={product.id} product={product} onQuickView={handleOpenQuickView} />
            ))}
          </div>
        )}
      </div>
      <QuickViewModal product={quickViewProduct} onClose={handleCloseQuickView} />
    </div>
  );
};

export default WishlistPage;
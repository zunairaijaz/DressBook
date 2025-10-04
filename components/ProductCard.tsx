"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Still needed for the main card link
import { useRouter } from 'next/navigation';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import StarIcon from './icons/StarIcon';
import HeartIcon from './icons/HeartIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  view?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, view = 'grid' }) => {
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter(); // Keep if you use it for e.g., login redirect
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const isInWishlist = wishlist.includes(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior if nested
    e.stopPropagation(); // Stop event from bubbling up to the Link wrapper
    if (!isAuthenticated) {
      router.push(`/login`);
      return;
    }

    setIsAdding(true);
    await addItem(product, 1);
    setIsAdding(false);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior if nested
    e.stopPropagation(); // Stop event from bubbling up to the Link wrapper
    toggleWishlist(product.id);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior if nested
    e.stopPropagation(); // Stop event from bubbling up to the Link wrapper
    onQuickView(product);
  };

  const renderStars = () => {
    const stars = [];
    // Ensure product.rating is a number, default to 0 if null/undefined
    const rating = Math.round(product.rating || 0); 
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productLink = `/product/${product.id}`;

  if (view === 'list') {
    return (
      // Wrap the entire list item with Link
      <Link href={productLink} 
            className="group relative flex bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg w-full">
        <div className="relative w-1/3 md:w-1/4 flex-shrink-0">
          {/* No nested Link needed here */}
          <div className="block aspect-w-1 aspect-h-1 w-full bg-gray-200 overflow-hidden">
            {/* Handle cases where images might be empty */}
            {product.images && product.images.length > 0 && (
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-center object-cover transition-transform duration-500 group-hover:scale-105"
                />
            )}
          </div>
          {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discountPercent}% OFF
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-base text-gray-800 font-semibold">
            {product.name} {/* No nested Link needed */}
          </h3>
          <div className="mt-2 flex items-center">
            {product.rating && product.rating > 0 ? ( // Check if rating exists and is > 0
              <>
                <div className="flex">{renderStars()}</div>
                <span className="ml-2 text-xs text-gray-500">{product.reviews?.length || 0} reviews</span> {/* Optional chaining for reviews */}
              </>
            ) : (
              <span className="text-xs text-gray-400">No reviews yet</span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 flex-grow">{product.description}</p>
          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
              {product.originalPrice && (
                <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-32 text-sm bg-accent text-primary py-2 px-4 rounded-md hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-wait flex items-center justify-center"
            >
              {isAdding ? <SpinnerIcon className="w-5 h-5" /> : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    // Wrap the entire grid item with Link
  <Link
  href={productLink}
  className="group relative flex flex-col rounded-lg overflow-hidden transition-shadow duration-300 "
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
  {/* Image Container */}
  <div className="relative w-full overflow-hidden">
    <div className="w-full relative pb-[120%]"> {/* Taller image */}
      <img
        src={isHovered && product.images.length > 1 ? product.images[1] : product.images[0]}
        alt={product.name}
        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    {/* Discount Badge */}
    {discountPercent > 0 && (
      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
        {discountPercent}% OFF
      </div>
    )}

    {/* Center Plus Button */}
  <button
  onClick={handleAddToCart}
  disabled={isAdding}
  className={`absolute top-[85%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-accent text-primary rounded-full flex items-center justify-center shadow-lg transition-all duration-300
    ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
    hover:bg-accent-hover disabled:bg-gray-400 disabled:cursor-wait`}
>
  {isAdding ? (
    <SpinnerIcon className="w-5 h-5" />
  ) : (
    <span className="text-lg font-bold">+</span>
  )}
</button>


    {/* Wishlist Button */}
    <button
      onClick={handleToggleWishlist}
      className={`absolute top-3 right-3 p-2 rounded-full bg-white/70 backdrop-blur-sm transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      aria-label="Toggle Wishlist"
    >
      <HeartIcon className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
    </button>

  </div>

  {/* Product Info */}
<div className="p-4 flex flex-col flex-grow bg-transparent">
  {/* Product Name */}
  <h3 className="text-sm text-gray-700 font-medium line-clamp-2">{product.name}</h3>

  {/* Price and Original Price on same line */}
  <div className="mt-1 flex items-center gap-2">
    <p className="text-base font-semibold text-gray-900">${product.price.toFixed(2)}</p>
    {product.originalPrice && (
      <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
    )}
  </div>
</div>

</Link>

  );
};

export default ProductCard;

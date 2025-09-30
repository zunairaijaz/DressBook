"use client";

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const isInWishlist = wishlist.includes(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
        navigate(`/login`, { state: { from: location } });
        return;
    }
    
    setIsAdding(true);
    await addItem(product, 1);
    setIsAdding(false);
  }

  const renderStars = () => {
    const stars = [];
    const rating = Math.round(product.rating);
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
  
  const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  if (view === 'list') {
     return (
       <div className="group relative flex bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg w-full">
         <div className="relative w-1/3 md:w-1/4 flex-shrink-0">
            <Link to={`/product/${product.id}`} className="block aspect-w-1 aspect-h-1 w-full bg-gray-200 overflow-hidden">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-center object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>
             {discountPercent > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {discountPercent}% OFF
                </div>
            )}
         </div>
         <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-base text-gray-800 font-semibold">
                <Link to={`/product/${product.id}`}>{product.name}</Link>
            </h3>
            <div className="mt-2 flex items-center">
              {product.rating > 0 ? (
                <>
                  <div className="flex">{renderStars()}</div>
                  <span className="ml-2 text-xs text-gray-500">{product.reviews.length} reviews</span>
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
       </div>
     );
  }

  // Grid view (default)
  return (
    <div 
      className="group relative flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-w-1 aspect-h-1 w-full bg-gray-200 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            className="w-full h-full object-center object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {discountPercent > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {discountPercent}% OFF
            </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <button
                onClick={() => onQuickView(product)}
                className="py-2 px-4 bg-white text-primary text-sm font-semibold rounded-md shadow-md hover:bg-gray-100 transition-all transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
            >
                Quick View
            </button>
        </div>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white/70 backdrop-blur-sm transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          aria-label="Toggle Wishlist"
        >
          <HeartIcon className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm text-gray-700 font-medium h-10">
          <Link to={`/product/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        
        <div className="mt-2 flex items-center">
          {product.rating > 0 ? (
            <>
              <div className="flex">{renderStars()}</div>
              <span className="ml-2 text-xs text-gray-500">{product.reviews.length} reviews</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">No reviews yet</span>
          )}
        </div>
        
        <div className="flex-grow"></div>
        
        <div className="flex items-end justify-between mt-4">
             <div>
                <p className="text-base font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                )}
            </div>
        </div>
         <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="mt-4 w-full text-sm bg-accent text-primary py-2 px-4 rounded-md hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-wait flex items-center justify-center"
          >
              {isAdding ? <SpinnerIcon className="w-5 h-5" /> : 'Add to Cart'}
          </button>
      </div>
    </div>
  );
};

export default ProductCard;
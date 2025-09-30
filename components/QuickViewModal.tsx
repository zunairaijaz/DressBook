"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import XMarkIcon from './icons/XMarkIcon';
import StarIcon from './icons/StarIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (product) {
      const defaultVariants: { [key: string]: string } = {};
      product.variants?.forEach(variant => {
        defaultVariants[variant.type] = variant.options[0].value;
      });
      setSelectedVariants(defaultVariants);
      setQuantity(1);
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'auto';
    }

    return () => {
        document.body.style.overflow = 'auto';
    }
  }, [product]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);
  
  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = async () => {
    if (product) {
      setIsAdding(true);
      await addItem({ ...product, selectedVariant: selectedVariants }, quantity);
      setIsAdding(false);
      handleClose();
    }
  };

  const handleDecrement = () => {
    setQuantity(q => Math.max(1, q - 1));
  };

  const handleIncrement = () => {
    if (product) {
      setQuantity(q => Math.min(product.stock, q + 1));
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      
      <div className={`relative bg-white w-full max-w-4xl m-4 rounded-lg shadow-xl transform transition-transform duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-center object-cover rounded-lg"
              />
            </div>

            <div className="flex flex-col">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-900">{product.name}</h2>
              
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                    <StarIcon
                        key={i}
                        className={`h-5 w-5 flex-shrink-0 ${product.rating > i ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                    ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">{product.reviews.length} reviews</span>
              </div>

              <p className="mt-3 text-2xl text-gray-900">${product.price.toFixed(2)}</p>

              <div className="mt-4 text-gray-600 text-sm space-y-4 flex-grow">
                <p>{product.description.split('.').slice(0, 2).join('.')}.</p>
              </div>

              {product.variants && (
                <div className="mt-6">
                  {product.variants.map(variant => (
                    <div key={variant.type}>
                      <h3 className="text-sm text-gray-800 font-medium">{variant.type}: <span className="text-gray-600">{selectedVariants[variant.type]}</span></h3>
                       <div className="flex items-center space-x-2 mt-2">
                          {variant.options.map(option => (
                             <button 
                                  key={option.value} 
                                  onClick={() => handleVariantChange(variant.type, option.value)}
                                  className={`px-3 py-1.5 border rounded-full text-xs font-medium ${selectedVariants[variant.type] === option.value ? 'bg-accent text-white border-accent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                              >
                                  {option.value}
                              </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6">
                <div className="flex items-center">
                    <label htmlFor="quantity-quick-view" className="text-sm font-medium text-gray-800 mr-4">Quantity</label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                            className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                        >
                            -
                        </button>
                        <span id="quantity-quick-view" className="w-12 text-center border-l border-r border-gray-300 py-1">{quantity}</span>
                        <button
                            onClick={handleIncrement}
                            disabled={quantity >= product.stock}
                            className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                </div>
              </div>


              <div className="mt-4 flex flex-col gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAdding}
                  className="w-full bg-accent border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-gray-300 disabled:cursor-wait"
                >
                  {isAdding ? <SpinnerIcon className="w-6 h-6" /> : 'Add to cart'}
                </button>
                <Link
                    to={`/product/${product.id}`}
                    onClick={handleClose}
                    className="text-center text-sm font-medium text-accent hover:text-accent-hover"
                >
                    View full details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
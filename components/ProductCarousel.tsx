// components/ProductCarousel.tsx
"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
    title: string;
    onQuickView: (product: Product) => void;
    categoryFilter?: string;
    limit?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, onQuickView, categoryFilter, limit }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Ensure we always get an array
            const productArray: Product[] = Array.isArray(data) ? data : data.products || [];

            let filtered = productArray;
            if (categoryFilter) {
                filtered = filtered.filter(p => p.category === categoryFilter);
            }
            if (limit) {
                filtered = filtered.slice(0, limit);
            }

            setProducts(filtered);
        } catch (err: any) {
            console.error("Failed to fetch products for carousel:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [categoryFilter, limit]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="bg-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
                {loading ? (
                    <p className="text-center text-gray-500">Loading {title.toLowerCase()}...</p>
                ) : error ? (
                    <p className="text-center text-red-500">Error loading {title.toLowerCase()}: {error}</p>
                ) : products.length === 0 ? (
                    <p className="text-center text-gray-500">No products available for {title.toLowerCase()}.</p>
                ) : (
                    <div className="relative group">
                        <div
                            ref={scrollRef}
                            className="flex space-x-6 overflow-x-auto pb-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {products.map(product => (
                                <div key={product.id} className="flex-shrink-0 w-64 sm:w-80">
                                    <ProductCard product={product} onQuickView={onQuickView} />
                                </div>
                            ))}
                            <style>
                                {`
                                    .overflow-x-auto::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}
                            </style>
                        </div>

                        <button
                            onClick={() => scroll('left')}
                            className="absolute top-1/2 left-2 -translate-y-1/2 transform bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-10 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            aria-label="Scroll left"
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute top-1/2 right-2 -translate-y-1/2 transform bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-10 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            aria-label="Scroll right"
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductCarousel;

import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
    title: string;
    products: Product[];
    onQuickView: (product: Product) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products, onQuickView }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

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
                {/* Added 'group' class here to enable hover effects on child elements (the buttons) */}
                <div className="relative group">
                    <div 
                        ref={scrollRef} 
                        className="flex space-x-6 overflow-x-auto pb-4" 
                        // FIX: Changed '-ms-overflow-style' to 'msOverflowStyle' to conform with React's camelCase style properties and fix the TypeScript error.
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {products.map(product => (
                            <div key={product.id} className="flex-shrink-0 w-64 sm:w-80">
                                <ProductCard product={product} onQuickView={onQuickView} />
                            </div>
                        ))}
                         {/* Hide scrollbar for WebKit browsers */}
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
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button 
                        onClick={() => scroll('right')} 
                        className="absolute top-1/2 right-2 -translate-y-1/2 transform bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-10 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                        aria-label="Scroll right"
                    >
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ProductCarousel;
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface FeaturedProductsProps {
  title: string;
  subtitle: string;
  products: Product[];
  onQuickView: (product: Product) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ title, subtitle, products, onQuickView }) => {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">{subtitle}</p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

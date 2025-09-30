"use client";

import React, { useState } from 'react';
import { Product } from '../types';
import HeroBanner from '../components/HeroBanner';
import QuickViewModal from '../components/QuickViewModal';
import ProductCarousel from '../components/ProductCarousel';
import CollectionList from '../components/CollectionList';
import Newsletter from '../components/Newsletter';

interface HomePageClientProps {
  featuredProducts: Product[];
  kitchenwareProducts: Product[];
  homeCategories: { name: string; image: string; }[];
}

const HomePageClient: React.FC<HomePageClientProps> = ({ featuredProducts, kitchenwareProducts, homeCategories }) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <div>
      <HeroBanner />
      <ProductCarousel 
        title="Featured Products" 
        products={featuredProducts}
        onQuickView={handleOpenQuickView}
      />
      <CollectionList 
        title="Shop by Category"
        subtitle="Browse our curated collections to find exactly what you need."
        collections={homeCategories}
      />
       <ProductCarousel 
        title="Top Kitchenware" 
        products={kitchenwareProducts}
        onQuickView={handleOpenQuickView}
      />
      <Newsletter />
      <QuickViewModal product={quickViewProduct} onClose={handleCloseQuickView} />
    </div>
  );
};

export default HomePageClient;

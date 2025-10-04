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
    
   
      <Newsletter />
      <QuickViewModal product={quickViewProduct} onClose={handleCloseQuickView} />
    </div>
  );
};

export default HomePageClient;

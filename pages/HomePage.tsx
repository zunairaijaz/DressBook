
import React, { useState } from 'react';
import { Product } from '../types';
import { products, categories } from '../data/products';
import HeroBanner from '../components/HeroBanner';
import QuickViewModal from '../components/QuickViewModal';
import ProductCarousel from '../components/ProductCarousel';
import CollectionList from '../components/CollectionList';
import Newsletter from '../components/Newsletter';
import Testimonial from '../components/Testimonial';


const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const newArrivals = [...products].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()).slice(0, 8);

  return (
    <div>
      <HeroBanner />
      <ProductCarousel 
        title="Featured Products" 
        products={products.slice(0, 8)}
        onQuickView={handleOpenQuickView}
      />
      <CollectionList 
        title="Shop by Category"
        subtitle="Browse our curated collections to find exactly what you need."
        collections={categories.slice(0, 4)}
      />
       <ProductCarousel 
        title="New Arrivals" 
        products={newArrivals}
        onQuickView={handleOpenQuickView}
      />
      <Testimonial />
      <Newsletter />
      <QuickViewModal product={quickViewProduct} onClose={handleCloseQuickView} />
    </div>
  );
};

export default HomePage;

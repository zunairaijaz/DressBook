"use client";

import React, { useState } from "react";
import { Product } from "../types";
import { products, categories } from "../data/products";
import HeroBanner from "../components/HeroBanner";
import QuickViewModal from "../components/QuickViewModal";
import ProductCarousel from "../components/ProductCarousel";
import CollectionList from "../components/CollectionList";
import Newsletter from "../components/Newsletter";
import Testimonial from "../components/Testimonial";
import FeaturedCollections from "@/components/FeatureSection";
const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const newArrivals = [...products]
    .sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    )
    .slice(0, 8);

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* ✨ New visually rich section */}
      <FeaturedCollections />


      {/* Testimonials */}
      <Testimonial />

      {/* Newsletter */}
      <Newsletter />

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={handleCloseQuickView} />
    </div>
  );
};

export default HomePage;

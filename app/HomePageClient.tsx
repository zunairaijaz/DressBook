"use client";

import React, { useState } from "react";
import { Product } from "../types";
import HeroBanner from "../components/HeroBanner";
import QuickViewModal from "../components/QuickViewModal";
import ProductCarousel from "../components/ProductCarousel";
import CollectionList from "../components/CollectionList";
import Newsletter from "../components/Newsletter";
import FeaturedCollections from "../components/FeatureSection"; // optional extra visual section

interface HomePageClientProps {
  featuredProducts: Product[];
  kitchenwareProducts: Product[];
  homeCategories: { name: string; image: string }[];
}

const HomePageClient: React.FC<HomePageClientProps> = ({
  featuredProducts,
  kitchenwareProducts,
  homeCategories,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <div>
      {/* 🖼 Hero Banner */}
      <HeroBanner />

      {/* ✨ Featured Collections / Visual section */}
      <FeaturedCollections />




      {/* 🗞 Newsletter Section */}
      <Newsletter />

      {/* 👁 Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={handleCloseQuickView}
      />
    </div>
  );
};

export default HomePageClient;

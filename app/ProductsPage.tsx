"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "../components/ProductCard";
import { products, categories } from "../data/products";
import { Product } from "../types";
import QuickViewModal from "../components/QuickViewModal";

const ProductsPage: React.FC = () => {
  const [allProducts] = useState<Product[]>(products);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "All"
  );
  const [priceRange, setPriceRange] = useState<number>(1500);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleOpenQuickView = (product: Product) => setQuickViewProduct(product);
  const handleCloseQuickView = () => setQuickViewProduct(null);

  // Sync category with query params
  useEffect(() => {
    const category = searchParams.get("category");
    setSelectedCategory(category || "All");
  }, [searchParams]);

  // Update meta tags dynamically
  useEffect(() => {
    const title =
      selectedCategory === "All" ? "All Products" : selectedCategory;
    document.title = `${title} | ShopSphere`;

    let metaDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    const descriptionContent =
      selectedCategory === "All"
        ? "Browse our entire collection of high-quality products at ShopSphere."
        : `Shop curated ${selectedCategory.toLowerCase()} at ShopSphere.`;

    metaDescription.setAttribute("content", descriptionContent);

    return () => {
      document.title = "ShopSphere";
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          "A modern, fully responsive e-commerce website designed to provide a seamless shopping experience."
        );
      }
    };
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      router.push("/products"); // clears query
    } else {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const categoryMatch =
        selectedCategory === "All" || product.category === selectedCategory;
      const priceMatch = product.price <= priceRange;
      return categoryMatch && priceMatch;
    });
  }, [allProducts, selectedCategory, priceRange]);

  const uniqueCategories = ["All", ...categories.map((c) => c.name)];

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base text-gray-500">
            Find the perfect item from our wide selection of products.
          </p>
        </div>

        <div className="pb-24 lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="space-y-10">
              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Category</h3>
                <div className="mt-4 space-y-2">
                  {uniqueCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        selectedCategory === category
                          ? "bg-accent text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Price</h3>
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    step="10"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-accent"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>$0</span>
                    <span>${priceRange}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products */}
          <main className="lg:col-span-3 mt-8 lg:mt-0">
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleOpenQuickView}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-10">
                  No products match your criteria.
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
      <QuickViewModal
        product={quickViewProduct}
        onClose={handleCloseQuickView}
      />
    </div>
  );
};

export default ProductsPage;

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "../data/filters";

const FeaturedCollections: React.FC = () => {
  const categoryImages: Record<string, string> = {
    Jackets:
    "https://images.pexels.com/photos/9634245/pexels-photo-9634245.jpeg?auto=compress&cs=tinysrgb&w=800", // jackets on rack
    Pants:
      "https://images.pexels.com/photos/7764611/pexels-photo-7764611.jpeg?auto=compress&cs=tinysrgb&w=800",
    Shirts:
    "https://images.pexels.com/photos/2112651/pexels-photo-2112651.jpeg?auto=compress&cs=tinysrgb&w=800",
    Shoes:
      "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800", // sneakers
    Accessories:
      "https://images.pexels.com/photos/325527/pexels-photo-325527.jpeg?auto=compress&cs=tinysrgb&w=800",
    Kurta:
      "https://images.pexels.com/photos/31874438/pexels-photo-31874438.jpeg?auto=compress&cs=tinysrgb&w=800",
    Trousers:
      "https://images.pexels.com/photos/34158798/pexels-photo-34158798.jpeg?auto=compress&cs=tinysrgb&w=800",
    Dresses:
      "https://images.pexels.com/photos/34183001/pexels-photo-34183001.jpeg?auto=compress&cs=tinysrgb&w=800",
    Tops:
      "https://images.pexels.com/photos/6311605/pexels-photo-6311605.jpeg?auto=compress&cs=tinysrgb&w=800", // yellow sweater style
  };
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
          Shop by Category
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Discover fashion for every occasion — from traditional wear to modern essentials.
        </p>

        <div className="grid gap-8 grid-cols-3">
        {categories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group relative bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <Link href={`/search?category=${encodeURIComponent(category)}`}>
                <div className="relative h-72 w-full">
                  <img
                    src={categoryImages[category] || "/images/placeholder.jpg"}
                    alt={category}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition duration-500" />
                  <div className="absolute bottom-0 p-6 text-left text-white">
                    <h3 className="text-2xl font-semibold mb-2">{category}</h3>
                    <p className="text-sm text-gray-200">
                      Explore our latest {category.toLowerCase()} collection.
                    </p>
                    <div className="mt-4 inline-block bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition">
                      Explore
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;

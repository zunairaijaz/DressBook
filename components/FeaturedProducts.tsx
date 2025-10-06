"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const featuredCollections = [
  {
    title: "New Arrivals",
    image: "https://images.pexels.com/photos/6311658/pexels-photo-6311658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    link: "/search?category=New",
    subtitle: "Fresh styles for the season",
  },
  {
    title: "Luxury Edit",
    image: "https://images.pexels.com/photos/2897883/pexels-photo-2897883.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    link: "/search?category=Luxury",
    subtitle: "Premium textures & timeless silhouettes",
  },
  {
    title: "Everyday Essentials",
    image: "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750",
    link: "/search?category=Essentials",
    subtitle: "Effortless fits for daily wear",
  },
];

const FeaturedCollections = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Explore Our Collections
          </h2>
          <p className="mt-3 text-gray-600 text-lg">
            Handpicked styles curated by <span className="font-semibold">The Dress Book</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCollections.map((collection, index) => (
            <motion.div
              key={index}
              className="relative rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={collection.image}
                alt={collection.title}
                className="h-[420px] w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-opacity duration-500"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-semibold"
                >
                  {collection.title}
                </motion.h3>
                <p className="mt-2 text-sm text-gray-200">{collection.subtitle}</p>
                <Link
                  href={collection.link}
                  className="mt-5 bg-white text-gray-900 font-medium px-6 py-2 rounded-full hover:bg-gray-200 transition"
                >
                  Shop Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const HeroBanner: React.FC = () => {
  const images = [
   
   "https://images.pexels.com/photos/19401514/pexels-photo-19401514.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
    "https://images.pexels.com/photos/20614156/pexels-photo-20614156.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
    "https://images.pexels.com/photos/20407194/pexels-photo-20407194.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
    "https://images.pexels.com/photos/19292833/pexels-photo-19292833.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds for smoother transition
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative bg-gray-900 h-[600px] sm:h-[700px] lg:h-[800px]">
      {/* Background image */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          src={images[currentIndex]}
          alt="Hero background"
          className="w-full h-full object-center object-cover transition-opacity duration-1000"
        />
      </div>

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gray-900 opacity-40"
      />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-48 lg:px-0">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Define Your Style
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-gray-200">
          Discover thoughtfully designed clothing and accessories that bring
          confidence, style, and intention to your wardrobe.
        </p>
        <Link
          href="/search"
          className="mt-8 inline-block bg-accent border border-transparent rounded-md py-3 px-10 text-base font-medium text-white hover:bg-accent-hover transition-colors"
        >
          Shop The Collection
        </Link>
      </div>
    </div>
  );
};

export default HeroBanner;

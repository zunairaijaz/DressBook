"use client";

import React from 'react';
import Link from 'next/link';

const HeroBanner: React.FC = () => {
  return (
    <div className="relative bg-gray-900">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          src="https://i.imgur.com/qLIIWAb.jpg"
          alt="Stylish woman posing in modern clothing"
          className="w-full h-full object-center object-cover"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gray-900 opacity-50" />

      <div className="relative max-w-4xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-48 lg:px-0">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Define Your Style</h1>
        <p className="mt-6 max-w-2xl text-xl text-gray-200">
          Discover thoughtfully designed clothing and accessories that bring confidence, style, and intention to your wardrobe.
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

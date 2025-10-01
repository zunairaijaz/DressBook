"use client";

import React from 'react';
import Link from 'next/link';
import LogoIcon from './icons/LogoIcon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <LogoIcon className="h-8 w-8 text-accent" />
              <span>The Dress Book</span>
            </Link>
            <p className="mt-4 text-gray-500 text-sm">Your one-stop shop for modern, high-quality fashion.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/search" className="text-base text-gray-500 hover:text-gray-900">All Products</Link></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">New Arrivals</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Best Sellers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">FAQ</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Shipping & Returns</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">About Us</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Press</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} The Dress Book. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-500">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-gray-500">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-gray-500">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

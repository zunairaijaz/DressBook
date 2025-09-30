
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import LogoIcon from './icons/LogoIcon';
import SearchIcon from './icons/SearchIcon';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

const Navbar: React.FC = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClickOutside = (event: MouseEvent) => {
    if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
      setAccountMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  
  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-amazon-blue text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <LogoIcon className="h-8 w-8 text-accent" />
              <span className="hidden sm:inline">The Dress Book</span>
            </Link>
          </div>
          
          <div className="flex-1 px-4 lg:px-12">
            <div className="relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input 
                  type="text"
                  placeholder="Search The Dress Book"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent/80 text-primary"
                />
                 <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-label="Search">
                    <SearchIcon />
                 </button>
              </form>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <div className="relative" ref={accountMenuRef}>
              <button onClick={() => setAccountMenuOpen(!isAccountMenuOpen)} className="text-white hover:text-gray-200 p-2 border border-transparent hover:border-white rounded">
                <div className="text-xs text-left">Hello, {user ? user.name.split(' ')[0] : 'Sign in'}</div>
                <div className="font-bold text-sm flex items-center">
                  Account & Lists
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </div>
              </button>
              {isAccountMenuOpen && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-20 text-primary overflow-hidden border border-gray-200">
                  <div className="p-4 border-b">
                    {user ? (
                      <button onClick={handleLogout} className="w-full text-center bg-accent text-primary font-semibold py-1.5 rounded-md hover:bg-accent-hover text-sm">Sign Out</button>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setAccountMenuOpen(false)} className="block w-full text-center bg-accent text-primary font-semibold py-1.5 rounded-md hover:bg-accent-hover text-sm">Sign in</Link>
                        <p className="text-xs text-center mt-2">New customer? <Link to="/signup" onClick={() => setAccountMenuOpen(false)} className="text-blue-600 hover:underline">Start here.</Link></p>
                      </>
                    )}
                  </div>
                  <div className="py-2">
                     <h3 className="font-bold px-4 text-md">Your Account</h3>
                      <Link to="/account" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">Your Account</Link>
                      <Link to="/wishlist" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">Your Wishlist</Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setAccountMenuOpen(false)} className="block px-4 py-2 text-sm font-bold text-accent hover:bg-gray-100">Admin Dashboard</Link>
                      )}
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/cart" className="relative text-white hover:text-gray-200 flex items-end gap-1 p-2 border border-transparent hover:border-white rounded">
              <div className="relative">
                <ShoppingCartIcon className="h-8 w-8" />
                <span className="absolute -top-1 left-3.5 font-bold text-accent text-md">{cartCount}</span>
              </div>
              <span className="hidden lg:block font-bold text-sm mt-2">Cart</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

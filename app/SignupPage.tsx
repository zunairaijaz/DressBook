"use client"; // Required for client-side components in Next.js App Router

import React, { useState } from 'react';
import Link from 'next/link'; // Import Link from next/link
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { useAuth } from '../hooks/useAuth';

// const { Link, useNavigate } = ReactRouterDOM; // Remove this line as we're using next/link and useRouter

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, loading } = useAuth();
  const router = useRouter(); // Use useRouter hook from next/navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) {
        setError('All fields are required.');
        return;
    }
    
    try {
        const success = await signup(name, email, password);
        if (success) {
          // Optionally show a success message before redirecting
          router.push('/login'); // Use router.push for navigation
        } else {
          // The error is now set in the AuthContext, but we can have a fallback
          setError('An account with this email already exists.');
        }
    } catch(err: any) {
        setError(err.message || 'Failed to create account.');
    }
  };
  
  const inputClasses = "appearance-none relative block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm";


  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${inputClasses} rounded-t-md`}
                placeholder="Your name"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClasses}`}
                placeholder="Email address"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClasses} rounded-b-md`}
                placeholder="Password"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:bg-gray-400 disabled:cursor-wait"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
            <p className="text-gray-600">Already have an account? {' '}
              {/* Use next/link for client-side navigation */}
              <Link href="/login" className="font-medium text-blue-600 hover:text-accent-hover">
                Sign in
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

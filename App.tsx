'use client';
import React from 'react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './app/HomePage';
import SearchPage from './app/SearchPage';
import ProductDetailPage from './app/ProductDetailPage';
import CartPage from './app/CartPage';
import CheckoutPage from './app/CheckoutPage';
import WishlistPage from './app/WishlistPage';
import LoginPage from './app/LoginPage';
import SignupPage from './app/SignupPage';
import AccountPage from './app/AccountPage';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './app/admin/dashboard/page';
import AdminProducts from './app/admin/products/page';
import AdminOrders from './app/admin/orders/page';
import AdminProductEdit from './app/admin/product-edit/page';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; // Optionally show a loader
  return <>{children}</>;
};

// Admin route wrapper
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;
  return <>{children}</>;
};

// Main App with Providers
const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

// Layout with Navbar and Footer
export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen font-sans bg-secondary">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);


export default App;

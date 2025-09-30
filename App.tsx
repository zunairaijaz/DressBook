
import React from 'react';
// FIX: Using namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
// FIX: The useAuth hook is imported from hooks/useAuth.ts, not the context file.
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProductEdit from './pages/admin/AdminProductEdit';


const { HashRouter, Routes, Route, Navigate, Outlet, useLocation } = ReactRouterDOM;

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

const AdminRoute: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <HashRouter>
            <Routes>
              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductEdit />} />
                  <Route path="products/edit/:id" element={<AdminProductEdit />} />
                  <Route path="orders" element={<AdminOrders />} />
                </Route>
              </Route>

              {/* Public Routes */}
              <Route path="/*" element={<MainApp />} />

            </Routes>
          </HashRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

// Main application layout with Navbar and Footer
const MainApp = () => (
  <div className="flex flex-col min-h-screen font-sans bg-secondary">
    <Navbar />
    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
      </Routes>
    </main>
    <Footer />
  </div>
);


export default App;
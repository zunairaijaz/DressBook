"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface CartItem {
  id: string;
  quantity: number;
  product: Product;
  selectedVariant?: Record<string, string>; // optional
}

const CheckoutPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const {  clearCart } = useCart();

  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/cart?userId=${user?.id}`);
        const data = await res.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, router, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.email) {
      alert("Please fill all required fields");
      return;
    }

    setPlacingOrder(true);

    try {
      const customer = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        address: formData.address,
      };

      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        selectedVariant: item.selectedVariant || null,
      }));

   const res = await fetch("/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    items: orderItems,
    totalPrice,
    shipping: 5,
    customer,
    userId: user!.id, // using non-null assertion after check
  }),
});


      const data = await res.json();
      if (data.success) {
  await clearCart(); 

        alert(`Order placed! Order ID: ${data.order?.id}`);
        setCartItems([]); // clear cart
        router.push(`/order-confirmation/${data.order?.id}`);
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!isAuthenticated) return <div className="text-center py-24">Redirecting to login...</div>;
  if (loading) return <div className="text-center py-24">Loading cart...</div>;
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty.</h1>
        <p className="mt-2 text-gray-600">You can't proceed to checkout without any items.</p>
        <Link
          href="/search"
          className="mt-6 inline-block bg-accent border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-accent-hover"
        >
          Shop for Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 text-center">
            Checkout
          </h1>

          <div className="mt-12 lg:grid lg:grid-cols-2 lg:gap-x-12">
            {/* Shipping Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-2 block w-full rounded-md border border-gray-400 shadow-sm py-3 px-3 focus:border-accent focus:ring-accent sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-2 block w-full rounded-md border border-gray-400 shadow-sm py-3 px-3 focus:border-accent focus:ring-accent sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-2 block w-full rounded-md border border-gray-400 shadow-sm py-3 px-3 focus:border-accent focus:ring-accent sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-2 block w-full rounded-md border border-gray-400 shadow-sm py-3 px-3 focus:border-accent focus:ring-accent sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
                <div className="mt-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment-method"
                      value="cod"
                      checked
                      readOnly
                      className="h-4 w-4 text-accent border-gray-400 focus:ring-accent"
                    />
                    <span className="text-gray-700 font-medium">Cash on Delivery</span>
                  </label>
                  <p className="text-gray-500 text-sm mt-2">Pay with cash upon delivery.</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-10 lg:mt-0">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 p-6 border-b border-gray-200">
                  Order summary
                </h3>
                <div className="p-6">
                  <ul role="list" className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex py-4">
                        <div className="flex space-x-2">
                          {(item.product.images || []).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${item.product.name} image ${idx + 1}`}
                              className="h-20 w-20 flex-none rounded-md object-cover object-center"
                            />
                          ))}
                          {(!item.product.images || item.product.images.length === 0) && (
                            <img
                              src="/placeholder.png"
                              alt="No image available"
                              className="h-20 w-20 flex-none rounded-md object-cover object-center"
                            />
                          )}
                        </div>

                        <div className="ml-4 flex-auto">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                          {item.selectedVariant && (
                            <p className="text-gray-500 text-sm">
                              Variant: {Object.values(item.selectedVariant).join(" / ")}
                            </p>
                          )}
                        </div>
                        <p className="flex-none font-medium text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <dl className="space-y-4 mt-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500">
                    <div className="flex justify-between">
                      <dt>Subtotal</dt>
                      <dd className="text-gray-900">${totalPrice.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Shipping</dt>
                      <dd className="text-gray-900">$5.00</dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-gray-900">
                      <dt className="text-base">Order total</dt>
                      <dd className="text-base">${(totalPrice + 5.0).toFixed(2)}</dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                      className="w-full bg-accent border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                    >
                      {placingOrder ? "Placing Order..." : "Place Order"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;




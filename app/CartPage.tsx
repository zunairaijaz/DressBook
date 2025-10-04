"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleCheckout = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-xl text-gray-500">Your cart is empty.</p>
            <Link
              href="/search"
              className="mt-6 inline-block bg-accent border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-accent-hover"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                {items.map((product) => (
                  <li key={product.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                      />
                    </div>

                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={`/product/${product.id}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product.name}
                              </Link>
                            </h3>
                          </div>
                          {product.selectedVariant && (
                            <p className="mt-1 text-sm text-gray-500">
                              {Object.values(product.selectedVariant).join(" / ")}
                            </p>
                          )}
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label htmlFor={`quantity-${product.id}`} className="sr-only">
                            Quantity, {product.name}
                          </label>
                          <div className="flex items-center border border-gray-300 rounded-md w-fit">
                            <button
                              onClick={() => updateQuantity(product.id, product.quantity - 1)}
                              disabled={product.quantity <= 1}
                              className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span
                              id={`quantity-${product.id}`}
                              className="w-12 text-center border-l border-r border-gray-300 py-1"
                            >
                              {product.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, product.quantity + 1)}
                              disabled={product.quantity >= product.stock}
                              className="px-3 py-1 text-lg font-medium text-gray-600 hover:bg-gray-100 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <div className="absolute top-0 right-0">
                            <button
                              type="button"
                              className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                              onClick={() => removeItem(product.id)}
                            >
                              <span className="sr-only">Remove</span>
                              <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
            >
              <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                Order summary
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">${totalPrice.toFixed(2)}</dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Shipping estimate</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                </div>
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Order total</dt>
                  <dd className="text-base font-medium text-gray-900">
                    ${(totalPrice + 5.0).toFixed(2)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <div className="flex space-x-2">
                    <input type="text" placeholder="Discount code" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" />
                    <button className="bg-gray-200 text-gray-600 px-4 rounded-md text-sm font-medium hover:bg-gray-300">Apply</button>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/checkout"
                  onClick={handleCheckout}
                  className="w-full bg-accent border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-accent block text-center"
                >
                  Checkout
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

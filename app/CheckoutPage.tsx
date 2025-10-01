import React from 'react';
import { useCart } from '../hooks/useCart';
// FIX: Using namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';

const { Link } = ReactRouterDOM;

const CheckoutPage: React.FC = () => {
    const { items, totalPrice } = useCart();
    
    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <h1 className="text-2xl font-semibold">Your cart is empty.</h1>
                <p className="mt-2 text-gray-600">You can't proceed to checkout without any items.</p>
                <Link
                    to="/search"
                    className="mt-6 inline-block bg-accent border border-transparent rounded-md py-3 px-8 text-base font-medium text-white hover:bg-accent-hover"
                >
                    Shop for Products
                </Link>
            </div>
        );
    }

    const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-base p-3 border-2";

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 text-center">Checkout</h1>
                    
                    <div className="mt-12 lg:grid lg:grid-cols-2 lg:gap-x-12">
                        {/* Shipping and Payment Form */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                                        <input type="text" id="first-name" name="first-name" className={inputClasses} />
                                    </div>
                                    <div>
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                                        <input type="text" id="last-name" name="last-name" className={inputClasses} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                        <input type="text" id="address" name="address" className={inputClasses} />
                                    </div>
                                    {/* ... More address fields */}
                                </div>
                            </div>
                            
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">Payment Details</h2>
                                <div className="mt-4 grid grid-cols-1 gap-y-6">
                                     <div>
                                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card number</label>
                                        <input type="text" id="card-number" name="card-number" placeholder="XXXX XXXX XXXX XXXX" className={inputClasses} />
                                    </div>
                                    {/* ... More payment fields */}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-10 lg:mt-0">
                             <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-900 p-6 border-b border-gray-200">Order summary</h3>
                                <div className="p-6">
                                    <ul role="list" className="divide-y divide-gray-200">
                                        {items.map(product => (
                                            <li key={product.id} className="flex py-4">
                                                <img src={product.images[0]} alt={product.name} className="h-20 w-20 flex-none rounded-md object-cover object-center"/>
                                                <div className="ml-4 flex-auto">
                                                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                    <p className="text-gray-500">Qty: {product.quantity}</p>
                                                </div>
                                                <p className="flex-none font-medium text-gray-900">${(product.price * product.quantity).toFixed(2)}</p>
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
                                            <dd className="text-base">${(totalPrice + 5.00).toFixed(2)}</dd>
                                        </div>
                                    </dl>
                                    <div className="mt-6">
                                        <button type="submit" className="w-full bg-accent border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                                            Place Order
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
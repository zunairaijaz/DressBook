
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { orders } from '../data/orders';

const AccountPage: React.FC = () => {
    const { user, logout } = useAuth();
    
    // In a real app, this would be an API call filtered by user ID.
    const userOrders = orders.slice(0, 2);

    if (!user) {
        return <div>Loading...</div>
    }

  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-4 lg:gap-x-12">
            <aside className="lg:col-span-1">
                <h2 className="text-xl font-bold text-gray-900">Hello, {user.name}</h2>
                <nav className="mt-6 space-y-1">
                    <a href="#" className="bg-gray-200 text-accent font-semibold group flex items-center px-3 py-2 text-sm rounded-md">
                        Order History
                    </a>
                    <a href="#" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                        Profile Details
                    </a>
                    <button onClick={logout} className="text-left w-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                        Sign Out
                    </button>
                </nav>
            </aside>
            <main className="lg:col-span-3 mt-12 lg:mt-0">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Your Orders</h1>
                    <p className="mt-2 text-sm text-gray-500">Check the status of recent orders.</p>
                </div>

                <section className="mt-8">
                    <h2 className="sr-only">Recent orders</h2>
                    <div className="space-y-8">
                        {userOrders.map(order => (
                            <div key={order.id} className="border border-gray-200 bg-white shadow-sm rounded-lg">
                                <div className="flex items-center p-4 border-b border-gray-200 sm:p-6">
                                    <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-3 sm:grid-cols-3 lg:col-span-2">
                                        <div>
                                            <dt className="font-medium text-gray-900">Order number</dt>
                                            <dd className="mt-1 text-gray-500">{order.id}</dd>
                                        </div>
                                        <div className="hidden sm:block">
                                            <dt className="font-medium text-gray-900">Date placed</dt>
                                            <dd className="mt-1 text-gray-500">
                                                <time dateTime={order.datetime}>{order.date}</time>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-medium text-gray-900">Total amount</dt>
                                            <dd className="mt-1 font-medium text-gray-900">${order.total?.toFixed(2)}</dd>
                                        </div>
                                    </dl>
                                </div>
                                 <div className="p-6">
                                    <p className="font-medium text-gray-900">{order.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
import React from 'react';
import StatCard from '../../components/admin/StatCard';
import { products } from '../../data/products';
import { orders } from '../../data/orders';

const AdminDashboard: React.FC = () => {
    
    // In a real app, this data would come from an API.
    const totalRevenue = orders.reduce((sum, order) => {
        return order.status !== 'Cancelled' ? sum + order.total : sum;
    }, 0);

    const totalOrders = orders.length;
    const totalProducts = products.length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
        <StatCard title="Total Orders" value={totalOrders.toString()} />
        <StatCard title="Total Products" value={totalProducts.toString()} />
      </div>

       <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order) => (
                    <li key={order.id}>
                        <a href="#" className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-accent truncate">{order.id}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {order.status}
                                </p>
                            </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                {order.customer.name}
                                </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <p>
                                    <time dateTime={order.datetime}>{order.date}</time>
                                </p>
                            </div>
                            </div>
                        </div>
                        </a>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;

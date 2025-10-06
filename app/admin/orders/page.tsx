"use client";

import React, { useState, useEffect } from "react";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

const STATUSES = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!newStatus) return;
    setUpdatingId(orderId);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    activeStatus === "All"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === activeStatus.toLowerCase()
        );

  if (loading) return <p className="text-center py-10">Loading orders...</p>;
  if (orders.length === 0)
    return <p className="text-center py-10">No orders found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Orders Management
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeStatus === status
                ? "bg-accent text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Order ID
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Customer
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-accent sm:pl-6">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                  {order.customerName}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {new Date(order.date).toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    disabled={updatingId === order.id}
                    className="px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No {activeStatus.toLowerCase()} orders found.
        </p>
      )}
    </div>
  );
};

export default AdminOrders;

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const OrderConfirmationPage: React.FC = () => {
  const params = useParams();
  const { orderId } = params as { orderId: string };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) setOrder(data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-center py-24">Loading...</div>;
  if (!order) return <div className="text-center py-24">Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p className="mb-2">Order ID: {order.id}</p>
      <p className="mb-4">Confirmation email sent to {order.customerEmail}</p>
      <button
        onClick={() => router.push("/search")}
        className="bg-accent text-white py-2 px-4 rounded-md hover:bg-accent-hover"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmationPage;

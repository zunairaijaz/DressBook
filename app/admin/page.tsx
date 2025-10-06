"use client";

import React, { useEffect, useState } from "react";
import { FaDollarSign, FaShoppingCart, FaBox, FaGlobe } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { feature } from "topojson-client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Order {
  id: string;
  total: number;
  status: string;
  datetime: string;
  customerName: string;
  country?: string;
}

interface Product {
  id: string;
  name: string;
}

// URL for world map topojson
const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [geographies, setGeographies] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await fetch("/api/orders");
        const ordersData = await ordersRes.json();
        const sortedOrders = (ordersData.orders || []).sort(
          (a: Order, b: Order) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
        setOrders(sortedOrders);

        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);

        // Load topojson world map
        const worldRes = await fetch(geoUrl);
        const worldData = await worldRes.json();
        const countries = feature(worldData, worldData.objects.countries).features;
        setGeographies(countries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const recentOrders = orders.slice(0, 10).slice(-7);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();

  const revenueByDay = last7Days.map((day) =>
    orders
      .filter(
        (o) => o.status === "Delivered" && o.datetime.slice(0, 10) === day
      )
      .reduce((sum, o) => sum + o.total, 0)
  );

  const ordersByDay = last7Days.map(
    (day) => orders.filter((o) => o.datetime.slice(0, 10) === day).length
  );

  // Sales by Location
  const salesByLocation = orders.reduce<Record<string, { total: number; count: number }>>((acc, order) => {
    if (!order.country) return acc;
    if (!acc[order.country]) acc[order.country] = { total: 0, count: 0 };
    acc[order.country].total += order.total;
    acc[order.country].count += 1;
    return acc;
  }, {});

  // D3 color scale for map
  const colorScale = scaleLinear<string>()
    .domain([0, Math.max(...Object.values(salesByLocation).map(d => d.total), 0)])
    .range(["#E0F2F1", "#00695C"]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>;
  }

  const statCardClasses =
    "flex items-center gap-4 p-6 rounded-xl shadow-lg bg-white text-gray-800 transform hover:scale-105 transition-all duration-300";

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className={`${statCardClasses} bg-gradient-to-r from-green-400 to-green-600 text-white`}>
          <FaDollarSign size={30} className="opacity-80" />
          <div>
            <p className="text-sm font-semibold uppercase">Total Revenue</p>
            <p className="text-2xl font-bold mt-1">${totalRevenue.toFixed(2)}</p>
            <p className="text-xs opacity-80 mt-1">Delivered orders only</p>
          </div>
        </div>

        <div className={`${statCardClasses} bg-gradient-to-r from-blue-400 to-blue-600 text-white`}>
          <FaShoppingCart size={30} className="opacity-80" />
          <div>
            <p className="text-sm font-semibold uppercase">Total Orders</p>
            <p className="text-2xl font-bold mt-1">{totalOrders}</p>
            <p className="text-xs opacity-80 mt-1">All orders placed</p>
          </div>
        </div>

        <div className={`${statCardClasses} bg-gradient-to-r from-purple-400 to-purple-600 text-white`}>
          <FaBox size={30} className="opacity-80" />
          <div>
            <p className="text-sm font-semibold uppercase">Total Products</p>
            <p className="text-2xl font-bold mt-1">{totalProducts}</p>
            <p className="text-xs opacity-80 mt-1">All products in store</p>
          </div>
        </div>

        <div className={`${statCardClasses} bg-gradient-to-r from-orange-400 to-orange-600 text-white`}>
          <FaGlobe size={30} className="opacity-80" />
          <div>
            <p className="text-sm font-semibold uppercase">Sales by Location</p>
            <p className="text-2xl font-bold mt-1">{Object.keys(salesByLocation).length}</p>
            <p className="text-xs opacity-80 mt-1">Countries with sales</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue Last 7 Days</h3>
          <Line
            data={{
              labels: last7Days,
              datasets: [
                {
                  label: "Revenue",
                  data: revenueByDay,
                  fill: true,
                  backgroundColor: "rgba(34,197,94,0.2)",
                  borderColor: "#22c55e",
                  tension: 0.4,
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Orders Last 7 Days</h3>
          <Bar
            data={{
              labels: last7Days,
              datasets: [
                {
                  label: "Orders",
                  data: ordersByDay,
                  backgroundColor: "#3b82f6",
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
      </div>

      {/* Sales by Location Map */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4">Sales by Location</h3>
        <ComposableMap
          projectionConfig={{ scale: 150 }}
          width={800}
          height={400}
        >
          <Geographies geography={geographies}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const salesData = salesByLocation[countryName];
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={salesData ? colorScale(salesData.total) : "#EEE"}
                    stroke="#DDD"
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Recent Orders */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">Recent Orders</h2>
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-gray-500">No recent orders.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <li key={order.id}>
                  <div className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition-all duration-300 rounded-xl mx-2 my-1 shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500">
                        <time dateTime={order.datetime}>
                          {new Date(order.datetime).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </p>
                      {order.country && (
                        <p className="text-xs text-gray-500 mt-1">{order.country}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold text-gray-800">${order.total.toFixed(2)}</p>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

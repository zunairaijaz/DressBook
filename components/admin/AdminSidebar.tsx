"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoIcon from "../icons/LogoIcon";
import HomeIcon from "../icons/HomeIcon";
import PackageIcon from "../icons/PackageIcon";
import ShoppingCartIcon from "../icons/ShoppingCartIcon";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Products", href: "/admin/products", icon: PackageIcon },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCartIcon },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-amazon-blue pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <LogoIcon className="h-8 w-8 text-accent" />
            <span>The Dress Book</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive =
                item.href === "/admin" 
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back to Shop */}
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <Link href="/" className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-white">← Back to Shop</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

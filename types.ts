export interface Review {
  id: string; // FIX: Changed to string
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Variant {
  type: string; // e.g., 'Color', 'Size'
  options: {
    value: string; // e.g., 'Red', 'Large'
    stock?: number;
  }[];
}

export interface Product {
  id: string; // FIX: Changed to string
  name: string; // Product Name
  price: number; // Current price
  originalPrice?: number; // Optional original price for showing discounts
  description: string;
  category: string; // Category e.g., Shirts, Pants
  brand: string; // Brand
  images: string[]; // Images
  reviews: Review[];
  rating: number;
  stock: number; // Stock Quantity
  variants?: Variant[]; // For Size, Color
  dateAdded: string;
  sku: string; // Stock Keeping Unit
  material?: string; // e.g., Cotton, Polyester
  gender?: 'Male' | 'Female' | 'Unisex'; // Gender
  pattern?: string; // e.g., Solid, Striped
  status: 'Active' | 'Inactive'; // Product status
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: { [key: string]: string };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
}

export interface Order {
    id: string;
    date: string;
    datetime: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    total: number;
    items: CartItem[];
    customer: {
      name: string;
      email: string;
    }
}

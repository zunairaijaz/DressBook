import { NextRequest, NextResponse } from 'next/server';
import { CartItem } from '../../../types';

// In-memory store for simplicity. In a real app, this would be a database.
let cart: CartItem[] = [];

// GET /api/cart
export async function GET(request: NextRequest) {
  return NextResponse.json(cart);
}

// POST /api/cart - Add item
export async function POST(request: NextRequest) {
  const { product, quantity } = await request.json();
  const existingItemIndex = cart.findIndex(cartItem => cartItem.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  return NextResponse.json(cart);
}

// PUT /api/cart - Update quantity
export async function PUT(request: NextRequest) {
  const { id, quantity } = await request.json();
  const itemIndex = cart.findIndex(cartItem => cartItem.id === id);

  if (quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  } else if (itemIndex > -1) {
    cart[itemIndex].quantity = quantity;
  } else {
    return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json(cart);
}

// DELETE /api/cart - Remove item
export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const initialLength = cart.length;
  cart = cart.filter(item => item.id !== id);

  if (cart.length === initialLength) {
     return NextResponse.json({ message: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json(cart);
}

// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET: Get all products
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    // FIX: Always return a JSON array, even on error, to prevent type errors.
    return NextResponse.json([], { status: 500 });
  }
}
// POST: Add a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, price, originalPrice, description, category, brand, images,
      stock, sku, material, gender, pattern, status,
    } = body;

    // Basic validation
    if (!name || !price || !description || !category || !brand || !images || !stock || !sku || !status) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        originalPrice: originalPrice || null,
        description,
        category,
        brand,
        images,
        stock,
        sku,
        material: material || null,
        gender: gender || null,
        pattern: pattern || null,
        status,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ message: 'Failed to add product' }, { status: 500 });
  }
}

// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

interface Params {
  params: { id: string };
}

// GET: Get a single product by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(`Error fetching product with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT/PATCH: Update an existing product by ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();

    // Prevent direct update of `id`, `dateAdded`, `rating` (if managed by system)
    const { id: _, dateAdded: __, rating: ___, ...updateData } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') { // Prisma error for record not found
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    console.error(`Error updating product with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE: Delete a product by ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') { // Prisma error for record not found
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    console.error(`Error deleting product with ID ${params.id}:`, error);
    return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
  }
}

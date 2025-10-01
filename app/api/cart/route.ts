import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const userId = 'YOUR_TEST_USER_ID'; // Replace with auth later

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    return NextResponse.json(cartItems);
  } catch (err) {
    console.error('GET /cart error:', err);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = 'YOUR_TEST_USER_ID'; // Replace with auth later
    const { product, quantity, selectedVariant } = await req.json();

    if (!product?.id || !quantity) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Check if item exists
    const existing = await prisma.cartItem.findFirst({
      where: { userId, productId: product.id },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId: product.id,
          quantity,
          selectedVariant: selectedVariant || null,
        },
      });
    }

    const cart = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    return NextResponse.json(cart);
  } catch (err) {
    console.error('POST /cart error:', err);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

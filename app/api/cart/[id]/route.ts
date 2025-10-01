// app/api/cart/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

interface Params {
  id: string;
}

// Update cart item quantity
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {
    const { quantity } = await req.json();
    const { id } = params;

    if (!id || quantity === undefined) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PUT /cart/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

// Delete cart item
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.cartItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /cart/[id] error:', err);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}

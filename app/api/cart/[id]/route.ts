import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- Update quantity ---
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    const id = context.params.id;
    try {
      const body = await req.json();
      const quantityChange = Number(body.quantity); // <--- fixed
  
      if (isNaN(quantityChange)) {
        return NextResponse.json({ error: "Invalid quantity change" }, { status: 400 });
      }
  
      const cartItem = await prisma.cartItem.findUnique({ where: { id } });
      if (!cartItem) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  
      const newQuantity = cartItem.quantity + quantityChange;
      if (newQuantity < 1) return NextResponse.json({ error: "Quantity cannot be less than 1" }, { status: 400 });
  
      const product = await prisma.product.findUnique({ where: { id: cartItem.productId } });
      if (product && newQuantity > product.stock) {
        return NextResponse.json({ error: "Quantity exceeds available stock" }, { status: 400 });
      }
  
      const updatedItem = await prisma.cartItem.update({
        where: { id },
        data: { quantity: newQuantity },
      });
  
      return NextResponse.json(updatedItem);
    } catch (err) {
      console.error("PUT /api/cart/[id] error:", err);
      return NextResponse.json({ error: "Failed to update quantity" }, { status: 500 });
    }
  }
  
// --- Delete cart item ---
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;
  try {
    const cartItem = await prisma.cartItem.findUnique({ where: { id } });
    if (!cartItem) return NextResponse.json({ error: "Cart item not found" }, { status: 404 });

    await prisma.cartItem.delete({ where: { id } });

    // Return updated cart for the user
    const updatedCart = await prisma.cartItem.findMany({
      where: { userId: cartItem.userId },
      include: { product: true },
    });

    return NextResponse.json(updatedCart);
  } catch (err) {
    console.error("DELETE /api/cart/[id] error:", err);
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 });
  }
}

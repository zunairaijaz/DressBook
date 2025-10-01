import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fallback guest ID
const ANONYMOUS_USER_ID = "00000000-0000-0000-0000-000000000000";

// Ensure anonymous user exists
async function ensureAnonymousUser() {
  await prisma.user.upsert({
    where: { id: ANONYMOUS_USER_ID },
    update: {},
    create: {
      id: ANONYMOUS_USER_ID,
      name: "Guest User",
      email: "guest@example.com",
      password: "", // optional
    },
  });
}

// --- GET /api/cart
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId") || ANONYMOUS_USER_ID;

    // Ensure the user exists
    if (userId === ANONYMOUS_USER_ID) {
      await ensureAnonymousUser();
    } else {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    return NextResponse.json(cartItems);
  } catch (err) {
    console.error("GET /api/cart error:", err);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// --- POST /api/cart
export async function POST(req: NextRequest) {
  try {
    const { product: productData, quantity, userId: incomingUserId } = await req.json();
    const userId = incomingUserId || ANONYMOUS_USER_ID;

    // Ensure user exists
    if (userId === ANONYMOUS_USER_ID) {
      await ensureAnonymousUser();
    } else {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    // Validate request
    if (!productData?.id || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Invalid request: missing product data or quantity" }, { status: 400 });
    }

    // Ensure product exists
    const productExists = await prisma.product.findUnique({ where: { id: productData.id } });
    if (!productExists) return NextResponse.json({ error: "Product does not exist" }, { status: 400 });

    const selectedVariant = productData.selectedVariant || null;

    // Check if cart item exists
    const existingCartItem = await prisma.cartItem.findFirst({
      where: { userId, productId: productData.id },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId: productData.id,
          quantity,
          selectedVariant,
        },
      });
    }

    const updatedCart = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    return NextResponse.json(updatedCart, { status: existingCartItem ? 200 : 201 });
  } catch (err: any) {
    console.error("POST /api/cart error:", err);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

// --- PUT /api/cart/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { quantity } = await req.json();
    if (!quantity || quantity <= 0) return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });

    await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity },
    });

    const updatedCart = await prisma.cartItem.findMany({ include: { product: true } });
    return NextResponse.json(updatedCart);
  } catch (err) {
    console.error("PUT /api/cart error:", err);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

// --- DELETE /api/cart/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.cartItem.delete({ where: { id: params.id } });
    const updatedCart = await prisma.cartItem.findMany({ include: { product: true } });
    return NextResponse.json(updatedCart);
  } catch (err) {
    console.error("DELETE /api/cart error:", err);
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 });
  }
}

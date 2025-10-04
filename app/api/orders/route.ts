// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma';


export async function POST(req: Request) {
  try {
    const body = await req.json();
  const { items, totalPrice, shipping, customer, userId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 });
    }

// Create order
const order = await prisma.order.create({
  data: {
    userId,  // use passed userId
    total: totalPrice + (shipping || 0),
    status: "pending",
    customerName: customer.name,
    customerEmail: customer.email,
    items: {
      create: items.map((item: any) => ({
        productId: item.productId, // matches frontend
        quantity: item.quantity,
        price: item.price,
      })),
    },
  },
  include: { items: true },
});


    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
 const orders = await prisma.order.findMany({
  include: { items: true },
  orderBy: { date: 'desc' },  // or datetime
});

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
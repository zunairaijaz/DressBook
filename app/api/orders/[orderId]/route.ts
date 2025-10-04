import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: {
    orderId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  const { orderId } = params;

  if (!orderId) {
    return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

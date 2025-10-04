import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });
    }

    await prisma.cartItem.deleteMany({ where: { userId } });

    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message || "Server error" }, { status: 500 });
  }
}

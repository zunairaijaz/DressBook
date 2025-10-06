import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface Params {
  params: {
    orderId: string;
  };
}

// ✅ Configure Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Get order by ID
export async function GET(req: Request, { params }: Params) {
  const { orderId } = params;

  if (!orderId) {
    return NextResponse.json(
      { success: false, message: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ✅ Update order status + send email via Gmail
export async function PUT(req: Request, { params }: Params) {
  const { orderId } = params;

  if (!orderId) {
    return NextResponse.json(
      { success: false, message: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required" },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });

    // Prepare email
    const emailHTML = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden;">
          <div style="background: #000; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">The Dress Book</h1>
            <p style="margin: 0; font-size: 14px;">Style Delivered with Grace</p>
          </div>

          <div style="padding: 25px;">
            <h2 style="color: #333;">Hi ${updatedOrder.customerName},</h2>
            <p style="font-size: 16px; color: #555;">
              Your order <strong>#${updatedOrder.id.slice(0, 8)}</strong> has been updated to:
            </p>

            <p style="font-size: 18px; font-weight: bold; color: #000;">${status}</p>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

            <h3 style="margin-bottom: 10px; color: #333;">Order Summary</h3>
            ${updatedOrder.items
              .map(
                (item) => `
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                  <img src="https://via.placeholder.com/70" alt="Product Image" 
                    style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover; margin-right: 15px;" />
                  <div>
                    <p style="margin: 0; color: #333;">${item.quantity} × Item</p>
                    <p style="margin: 0; color: #777;">$${item.price.toFixed(2)}</p>
                  </div>
                </div>`
              )
              .join("")}

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
            <p style="font-size: 16px; font-weight: bold; color: #000;">
              Total: $${updatedOrder.total.toFixed(2)}
            </p>

            <p style="font-size: 14px; color: #555; margin-top: 20px;">
              We'll notify you when your order status changes again.
            </p>

            <p style="margin-top: 20px; color: #333;">Thank you for shopping with <strong>The Dress Book</strong>!</p>
          </div>

          <div style="background: #f1f1f1; padding: 15px; text-align: center; color: #777; font-size: 12px;">
            © ${new Date().getFullYear()} The Dress Book. All rights reserved.
          </div>
        </div>
      </div>
    `;

    // Send the email
    await transporter.sendMail({
      from: `"The Dress Book" <${process.env.EMAIL_USER}>`,
      to: updatedOrder.customerEmail,
      subject: `Your Order #${updatedOrder.id.slice(0, 8)} - ${status}`,
      html: emailHTML,
    });

    console.log(`✅ Email sent to ${updatedOrder.customerEmail}`);

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (err: any) {
    console.error("Error updating order status:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

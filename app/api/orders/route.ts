import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import nodemailer from "nodemailer";

// ✅ Setup Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail app password
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, totalPrice, shipping = 0, customer, userId } = body;

    if (!items?.length) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!customer?.email || !customer?.name) {
      return NextResponse.json(
        { success: false, message: "Customer details are missing" },
        { status: 400 }
      );
    }

    // ✅ Create order in DB
    const order = await prisma.order.create({
      data: {
        userId,
        total: totalPrice + shipping,
        status: "pending",
        customerName: customer.name,
        customerEmail: customer.email,
        address: customer.address, 
        country: customer.country, 
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
    

    // ✅ Create modern HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 30px;">
        <div style="max-width: 650px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">

          <!-- Header -->
          <div style="background-color: #111; color: #fff; text-align: center; padding: 30px 20px;">
            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px;">The Dress Book</h1>
            <p style="margin: 8px 0 0; font-size: 15px; color: #ddd;">Your order has been confirmed</p>
          </div>

          <!-- Greeting -->
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${order.customerName}</strong>,</p>
            <p style="font-size: 15px; color: #555;">
              Thank you for shopping with <strong>The Dress Book</strong>! Your order <strong>#${order.id}</strong> has been successfully placed.
            </p>
          </div>

          <!-- Product List -->
          <div style="padding: 0 30px;">
            ${items
              .map(
                (item: any) => `
                  <div style="display: flex; align-items: center; border-bottom: 1px solid #eee; padding: 15px 0;">
                    <img src="${item.product?.images?.[0] || "https://via.placeholder.com/100"}"
                         alt="${item.product?.name || "Product"}"
                         style="width: 90px; height: 90px; border-radius: 8px; object-fit: cover; margin-right: 15px;">
                    <div style="flex: 1;">
                      <p style="margin: 0; font-weight: 500; font-size: 15px; color: #222;">${item.product?.name || "Fashion Item"}</p>
                      <p style="margin: 5px 0 0; color: #888;">Qty: ${item.quantity}</p>
                    </div>
                    <p style="margin: 0; font-weight: bold; color: #000;">$${item.price.toFixed(2)}</p>
                  </div>`
              )
              .join("")}
          </div>

          <!-- Summary -->
          <div style="padding: 25px 30px;">
            <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 15px; color: #555;">
              <span>Subtotal:</span><span>$${totalPrice.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 15px; color: #555;">
              <span>Shipping:</span><span>$${shipping.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; color: #000; margin-top: 10px;">
              <span>Total:</span><span>$${(totalPrice + shipping).toFixed(2)}</span>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://thedressbook.com/orders/${order.id}" 
                 style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 5px; display: inline-block;">
                 View My Order
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #fafafa; padding: 20px; text-align: center; font-size: 13px; color: #777;">
            <p>We’ll notify you once your order ships.</p>
            <p>Need help? <a href="mailto:support@thedressbook.com" style="color: #000;">Contact us</a></p>
            <p style="margin-top: 10px; color: #aaa;">© ${new Date().getFullYear()} The Dress Book. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    // ✅ Send Email
    await transporter.sendMail({
      from: `"The Dress Book" <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: `Your Order Confirmation - #${order.id}`,
      html: htmlContent,
    });

    console.log(`✅ Order confirmation sent to ${order.customerEmail}`);
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error("❌ Error creating order:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

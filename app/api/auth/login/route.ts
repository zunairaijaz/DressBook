import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    return NextResponse.json({ user, token });
  } catch (err) {
    return NextResponse.json({ message: "Login failed", error: String(err) }, { status: 500 });
  }
}

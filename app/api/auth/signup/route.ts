import { NextRequest, NextResponse } from 'next/server'; // Use NextRequest and NextResponse for App Router
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma'; // Adjust path if necessary

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Export a named function for the POST method
export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json(); // Parse JSON body using await req.json()

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 }); // Use NextResponse for responses
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'user' },
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    return NextResponse.json({ token, user }, { status: 200 }); // Use NextResponse for responses
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 }); // Handle errors with NextResponse
  }
}

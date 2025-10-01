import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma'; // Adjust path if necessary

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export async function POST(req: Request) { // Changed function signature
  const { email, password } = await req.json(); // Changed body access

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    return new Response(JSON.stringify({ token, user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

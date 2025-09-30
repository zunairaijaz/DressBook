import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request: NextRequest) {
  const cookie = serialize('session_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    expires: new Date(0), // Expire the cookie immediately
    path: '/',
  });

  const response = NextResponse.json({ message: 'Logged out' });
  response.headers.set('Set-Cookie', cookie);
  return response;
}

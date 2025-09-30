
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { USERS_DB } from '../db';
// FIX: Import Buffer to resolve 'Cannot find name 'Buffer'' error.
import { Buffer } from 'buffer';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get('session_token');

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  try {
    const decoded = JSON.parse(Buffer.from(token.value, 'base64').toString('utf8'));
    const users = USERS_DB.getUsers();
    const user = users.find(u => u.id === decoded.sub);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { password, ...userToReturn } = user;
    return NextResponse.json({ user: userToReturn });

  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
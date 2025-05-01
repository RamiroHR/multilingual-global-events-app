import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/user';
import { hashPassword } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const { email, username, password } = await req.json();

  if (!email || !username || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Check if user exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user and password
  const user = await createUser(email, username, hashedPassword)

  return NextResponse.json({ id: user.id, email: user.email, username: user.username });
}
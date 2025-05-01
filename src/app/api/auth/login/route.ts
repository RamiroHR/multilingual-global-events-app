import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/user';
import { comparePassword, generateToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Find if user exists and its stored hashedPassword
  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Compare password
  const isValid = await comparePassword(password, user.password.password)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Create JWT
  const token = generateToken({ userId: user.id, email: user.email });

  return NextResponse.json({ token });
}
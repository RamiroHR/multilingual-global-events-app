'use client'

import AuthForm from '../AuthForm';
import Link from 'next/link';

export default function LoginPage() {

  const handleLogin = async ({ email, password } : { email: string, password: string}) => {

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-type': 'application/json'},
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login Failed')
    }

    // if res ok, then handle JWT token -- to-do
  }

  return(
    <>
      <AuthForm
        type='login'
        onSubmit={handleLogin}
      />
      <Link
        href="/signup"
        className="text-blue-500 hover:underline text-center block mt-4"
      >
        Don't have an account? Sign Up
      </Link>
    </>
  );
}
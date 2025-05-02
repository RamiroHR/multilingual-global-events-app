'use client'

import AuthForm from '../AuthForm';
import Link from 'next/link';

export default function SignupPage() {

  const handleSignup = async ({
    email,
    password,
    username
  } : {
    email: string,
    password: string,
    username?: string,
  }) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
      headers:{ 'Content-type' : 'application/json' },
    });

    if(!res.ok) {
      const data = await res.json()
      throw new Error( data.error || 'Signup Failed')
    }

    // TODO:
    // if res ok:
    // redirect to login or display a sucsess message

  }

  return(
    <>
      <AuthForm
      type='signup'
      onSubmit={handleSignup}
      />
      <Link
        href='/login'
        className="text-blue-500 hover:underline text-center block mt-4"
      >
        Go to login
      </Link>
    </>

  );
}
'use client'

import AuthForm from '../AuthForm';
import { Link, useRouter } from '@/i18n/navigation';
import axios from 'axios';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async ({
    email,
    password,
    username
  } : {
    email: string,
    password: string,
    username?: string,
  }) => {
    try {
      const res = await axios.post('/api/auth/signup', { email, password, username })
      router.push('/login');
    } catch(error: any) {
      const message = error.response?.data?.error || 'Signup Failed'
      throw new Error(message)
    }
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
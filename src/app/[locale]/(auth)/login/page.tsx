'use client'

import { useTranslations } from 'next-intl';
import AuthForm from '../AuthForm';
import { Link, useRouter } from '@/i18n/navigation';
import axios from 'axios';


export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const router = useRouter();

  const handleLogin = async ({ email, password } : { email: string, password: string}) => {
    try{
      const res = await axios.post('/api/auth/login', { email, password })
      const token = res.data.token          // store jwt token in local storage
      localStorage.setItem('token',token)
      router.push('/dashboard')             // redirect to main dashboard
    } catch(error: any) {
      const message = error.response?.data?.error || 'Login Failed'
      throw new Error(message)
    }
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
        {t('cta')}
      </Link>
    </>
  );
}
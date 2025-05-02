import React from 'react';
import {useTranslations} from 'next-intl';
import Link from 'next/link'

export default function AuthLayout({ children }: { children : React.ReactNode }) {
  const t = useTranslations('AuthLayout')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center from-slate-100 to-blue-200" >
      <header className="mb-5">
        <h1 className="text-center">
          <Link href='/'>
            <span className="block text-3xl text-blue-600 font-bold italic">{t('app-name')}</span>
          </Link>
          <span className="block text-m text-gray-300 italic">{t('teasing')}</span>
        </h1>
        {/* <p className="text-gray-600 text-center mt-4">
          {t('cta')}
        </p> */}
      </header>
      <main className="bg-gray-700 p-8 rounded-lg shadow-lg">
        {children}
      </main>
    </div>
  );
}
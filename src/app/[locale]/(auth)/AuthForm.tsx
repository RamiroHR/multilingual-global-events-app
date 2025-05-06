'use client'
import React from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

type AuthFormProps = {
  type: 'login' | 'signup';
  onSubmit: (data: {email: string, password: string, username?: string}) => Promise<void>;
}

export default function AuthForm({type, onSubmit}: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // set locale messages to use
  let t;
  if (type === 'login') {
    t = useTranslations("LoginPage");
  }
  if (type === 'signup') {
    t = useTranslations("SignupPage");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (type === 'login') await onSubmit({email, password});
      if (type === 'signup') await onSubmit({email, password, username});
      setSuccess(t('success-message'));
    } catch (err: any) {
      setError(err.message || t('error-message'));
    }
  }

  return(
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-center">
        {t('title')}
      </h2>
      <input
        type="email"
        placeholder={t('email')}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="bg-blue-100 text-gray-500 border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      {type === 'signup' && (
        <input
          type="username"
          placeholder={t('username')}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="bg-blue-100 text-gray-500 border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      )}
      <input
        type="password"
        placeholder={t('password')}
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="bg-blue-100 text-gray-500 border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <button
        type='submit'
        className="bg-blue-500 text-gray-100 px-2 py-2 rounded hover:bg-blue-600 font-semibold"
      >
        {t('button')}
      </button>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
    </form>
  );
}

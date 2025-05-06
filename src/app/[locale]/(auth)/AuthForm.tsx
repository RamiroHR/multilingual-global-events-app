'use client'
import React from 'react';
import { useState } from 'react';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (type === 'login') await onSubmit({email, password});
      if (type === 'signup') await onSubmit({email, password, username});
      setSuccess(`${type} submission succeeded`);
    } catch (err: any) {
      setError(err.message || `Something went wrong: ${type} submission failed`);
    }
  }

  return(
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-center">
        {type==='login'? 'Login' : 'Signup'}
      </h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        className="bg-blue-100 text-gray-500 border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      {type === 'signup' && (
        <input
          type="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="bg-blue-100 text-gray-500 border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      )}
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="bg-blue-100 text-gray-500 border rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <button
        type='submit'
        className="bg-blue-500 text-gray-100 px-2 py-2 rounded hover:bg-blue-600 font-semibold"
      >
        {type==='login'? 'Login' : 'Signup'}
      </button>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
    </form>
  );
}

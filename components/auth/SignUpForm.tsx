'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';

export function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthStore();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 rounded border bg-opacity-50 text-white focus:outline-none focus:border-orange-500"
          style={{
            backgroundColor: 'rgba(30, 30, 30, 0.5)',
            borderColor: 'rgba(255, 90, 0, 0.3)',
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 rounded border bg-opacity-50 text-white focus:outline-none focus:border-orange-500"
          style={{
            backgroundColor: 'rgba(30, 30, 30, 0.5)',
            borderColor: 'rgba(255, 90, 0, 0.3)',
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 rounded border bg-opacity-50 text-white focus:outline-none focus:border-orange-500"
          style={{
            backgroundColor: 'rgba(30, 30, 30, 0.5)',
            borderColor: 'rgba(255, 90, 0, 0.3)',
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-3 py-2 rounded border bg-opacity-50 text-white focus:outline-none focus:border-orange-500"
          style={{
            backgroundColor: 'rgba(30, 30, 30, 0.5)',
            borderColor: 'rgba(255, 90, 0, 0.3)',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 rounded font-mono font-bold text-white transition-all disabled:opacity-50"
        style={{ backgroundColor: '#ff5a00' }}
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}

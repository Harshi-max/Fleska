'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0f0f0f' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Restaurant POS</h1>
          <p style={{ color: '#9ca3af' }}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <div
          className="rounded-lg border p-8"
          style={{
            backgroundColor: 'rgba(15, 15, 15, 0.5)',
            borderColor: 'rgba(255, 90, 0, 0.2)',
          }}
        >
          {!isSignUp ? (
            <LoginForm />
          ) : (
            <div>
              {/* SignUp form will be loaded dynamically */}
              <p style={{ color: '#9ca3af' }}>Sign up feature coming soon</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p style={{ color: '#9ca3af' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-bold hover:underline"
                style={{ color: '#ff5a00' }}
              >
                {isSignUp ? 'Login' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm hover:underline" style={{ color: '#ff5a00' }}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

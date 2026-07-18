'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Zap, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: 'admin@fleksa.com',
    password: 'admin123',
  });

  const DEMO_ACCOUNTS = [
    { email: 'admin@fleksa.com', password: 'admin123', name: 'Admin', role: 'Admin' },
    { email: 'manager@fleksa.com', password: 'manager123', name: 'Manager', role: 'Manager' },
    { email: 'chef@fleksa.com', password: 'chef123', name: 'Chef', role: 'Chef' },
    { email: 'waiter@fleksa.com', password: 'waiter123', name: 'Waiter', role: 'Waiter' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDemoAccount = (email: string, password: string, name: string) => {
    setFormData({ email, password, name });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignup 
        ? { email: formData.email, password: formData.password, name: formData.name }
        : { email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #050816 0%, #1a1a2e 100%)' }}>
      <div className="w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8" style={{ color: '#ff5a00' }} />
            <h1 className="text-3xl font-bold" style={{ color: '#ff5a00' }}>FLEKSA</h1>
          </div>
          <p className="text-gray-400">Enterprise POS System</p>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-md rounded-xl p-8 border" style={{ backgroundColor: 'rgba(15, 15, 15, 0.5)', borderColor: 'rgba(255, 90, 0, 0.2)' }}>
          {/* Tab Switch */}
          <div className="flex gap-2 mb-6 rounded-lg p-1" style={{ backgroundColor: 'rgba(255, 90, 0, 0.05)' }}>
            <button
              onClick={() => { setIsSignup(false); setError(''); }}
              className="flex-1 py-2 rounded font-medium transition"
              style={{
                backgroundColor: !isSignup ? '#ff5a00' : 'transparent',
                color: !isSignup ? '#fff' : '#999'
              }}
            >
              Login
            </button>
            <button
              onClick={() => { setIsSignup(true); setError(''); }}
              className="flex-1 py-2 rounded font-medium transition"
              style={{
                backgroundColor: isSignup ? '#ff5a00' : 'transparent',
                color: isSignup ? '#fff' : '#999'
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg text-red-200 mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Signup only) */}
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 transition"
                    style={{ backgroundColor: 'rgba(15, 15, 15, 0.5)', borderColor: 'rgba(255, 90, 0, 0.2)', color: '#e5e7eb' }}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-orange-500 transition"
                  style={{ backgroundColor: 'rgba(15, 15, 15, 0.5)', borderColor: 'rgba(255, 90, 0, 0.2)', color: '#e5e7eb' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:border-orange-500 transition"
                  style={{ backgroundColor: 'rgba(15, 15, 15, 0.5)', borderColor: 'rgba(255, 90, 0, 0.2)', color: '#e5e7eb' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isSignup && <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg font-semibold text-white transition duration-200 hover:opacity-90 disabled:opacity-70"
              style={{ backgroundColor: '#ff5a00' }}
            >
              {loading ? (isSignup ? 'Creating Account...' : 'Signing In...') : (isSignup ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Demo Accounts */}
          {!isSignup && (
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(255, 90, 0, 0.2)' }}>
              <p className="text-center text-gray-400 text-sm mb-3">Quick Demo Access:</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => handleDemoAccount(account.email, account.password, account.name)}
                    className="px-3 py-2 rounded text-sm font-mono transition hover:opacity-80"
                    style={{ backgroundColor: 'rgba(15, 15, 15, 0.5)', borderColor: 'rgba(255, 90, 0, 0.2)', border: '1px solid', color: '#e5e7eb' }}
                  >
                    {account.role}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          {isSignup ? 'Already have an account? ' : 'Don&apos;t have an account? '}
          <button
            onClick={() => { setIsSignup(!isSignup); setError(''); }}
            className="text-orange-500 hover:underline"
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}

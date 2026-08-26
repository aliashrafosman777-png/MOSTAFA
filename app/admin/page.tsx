'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-flight-900/30 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-display-md text-white mb-2">Admin</h1>
          <p className="text-sm text-sage">Sign in to manage contact messages</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8 border border-line rounded-sm bg-obsidian/60 backdrop-blur-sm"
        >
          {/* Error */}
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="admin-email" className="block text-sm text-mist mb-2">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-flight-950 border border-line text-white placeholder-sage/50 rounded-sm text-sm focus:outline-none focus:border-runway/50 transition-colors duration-300"
              placeholder="admin@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="admin-password" className="block text-sm text-mist mb-2">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-flight-950 border border-line text-white placeholder-sage/50 rounded-sm text-sm focus:outline-none focus:border-runway/50 transition-colors duration-300"
              placeholder="••••••••••"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-carbon font-semibold text-sm rounded-sm hover:bg-ivory transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Back to site */}
        <p className="text-center mt-8">
          <Link href="/" className="text-xs text-sage hover:text-mist transition-colors duration-300">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

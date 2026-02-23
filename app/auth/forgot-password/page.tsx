'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Masukkan alamat email Anda');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Terjadi kesalahan');
      } else {
        setSuccess(data.message);
        setEmail('');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl overflow-hidden p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Lupa Kata Sandi?</h3>
        <p className="text-sm text-gray-400">
          Masukkan email yang terdaftar dan kami akan mengirimkan link untuk mereset kata sandi Anda.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {success}
          </div>
        )}

        {!success && (
          <>
            <Input
              label="Alamat Email"
              name="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-600 focus:border-red-500 focus:ring-red-500/20 rounded-xl py-3"
              labelClassName="text-gray-300 font-medium ml-1"
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all transform hover:-translate-y-0.5"
            >
              Kirim Link Reset
            </Button>
          </>
        )}
      </form>

      <div className="mt-8 text-center text-sm border-t border-gray-700/50 pt-6">
        <p className="text-gray-400">
          Sudah ingat kata sandi?{' '}
          <Link href="/auth/login" className="font-semibold text-red-500 hover:text-red-400 transition-colors">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </div>
  );
}

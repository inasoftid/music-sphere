'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.password || !formData.confirmPassword) {
      setError('Semua field wajib diisi');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi dan konfirmasi tidak cocok');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Terjadi kesalahan');
      } else {
        setSuccess(data.message);
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Link Tidak Valid</h3>
          <p className="text-sm text-gray-400 mb-6">
            Link reset kata sandi tidak valid atau sudah kedaluwarsa.
          </p>
          <Link
            href="/auth/forgot-password"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            Minta Link Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl overflow-hidden p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Reset Kata Sandi</h3>
        <p className="text-sm text-gray-400">
          Masukkan kata sandi baru untuk akun Anda.
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

        {success ? (
          <div className="text-center">
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm flex items-center gap-2 mb-6">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              Masuk Sekarang
            </Link>
          </div>
        ) : (
          <>
            <Input
              label="Kata Sandi Baru"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-600 focus:border-red-500 focus:ring-red-500/20 rounded-xl py-3"
              labelClassName="text-gray-300 font-medium ml-1"
            />

            <Input
              label="Konfirmasi Kata Sandi"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
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
              Simpan Kata Sandi Baru
            </Button>
          </>
        )}
      </form>

      {!success && (
        <div className="mt-8 text-center text-sm border-t border-gray-700/50 pt-6">
          <p className="text-gray-400">
            Sudah ingat kata sandi?{' '}
            <Link href="/auth/login" className="font-semibold text-red-500 hover:text-red-400 transition-colors">
              Kembali ke Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl overflow-hidden p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-4 text-sm">Memuat...</p>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      await login(formData); // Pass full formData (email + password)
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl overflow-hidden p-8">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Selamat Datang</h3>
        <p className="text-sm text-gray-400">Masuk untuk melanjutkan perjalanan musikmu</p>
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
        
        <Input
          label="Alamat Email"
          name="email"
          type="email"
          placeholder="nama@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-600 focus:border-red-500 focus:ring-red-500/20 rounded-xl py-3"
          labelClassName="text-gray-300 font-medium ml-1"
        />
        
        <Input
          label="Kata Sandi"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-600 focus:border-red-500 focus:ring-red-500/20 rounded-xl py-3"
          labelClassName="text-gray-300 font-medium ml-1"
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-700 bg-gray-900/50 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400 hover:text-gray-300 cursor-pointer">
              Ingat saya
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-red-500 hover:text-red-400 transition-colors">
              Lupa kata sandi?
            </a>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all transform hover:-translate-y-0.5"
        >
          Masuk
        </Button>
      </form>

      <div className="mt-8 text-center text-sm border-t border-gray-700/50 pt-6">
        <p className="text-gray-400">
          Belum punya akun?{' '}
          <Link href="/auth/register" className="font-semibold text-red-500 hover:text-red-400 transition-colors">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

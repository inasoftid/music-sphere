'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function VerifyPage() {
  const { verifyEmail, isLoading } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length < 6) {
      setError('Harap masukkan kode 6 digit yang valid');
      return;
    }

    try {
      await verifyEmail(code);
    } catch (err) {
      setError('Kode verifikasi tidak valid. Coba "123456".');
    }
  };

  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-xl overflow-hidden p-8">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Verifikasi Email</h3>
        <p className="text-sm text-gray-400">Kami telah mengirimkan kode ke email Anda. Silakan masukkan di bawah ini.</p>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Input
            label="Kode Verifikasi"
            name="code"
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={6}
            className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-600 focus:border-red-500 focus:ring-red-500/20 rounded-xl py-4 text-center text-3xl tracking-[1em] font-mono"
            labelClassName="text-gray-300 font-medium ml-1"
          />
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-red-600/20 transition-all transform hover:-translate-y-0.5"
        >
          Verifikasi
        </Button>
      </form>

      <div className="mt-8 text-center text-sm border-t border-gray-700/50 pt-6">
        <p className="text-gray-400">
          Tidak menerima kode?{' '}
          <button className="font-semibold text-red-500 hover:text-red-400 transition-colors focus:outline-none">
            Kirim Ulang
          </button>
        </p>
      </div>
    </div>
  );
}

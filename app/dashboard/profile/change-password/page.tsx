'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Password baru tidak cocok');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password baru minimal 6 karakter');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengubah password');
      }

      setSuccess('Password berhasil diubah');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <h1 className="text-2xl font-bold text-white">Ubah Password</h1>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <Input
            label="Password Saat Ini"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            placeholder="Masukkan password saat ini"
          />

          <Input
            label="Password Baru"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            required
             placeholder="Minimal 6 karakter"
          />

          <Input
            label="Konfirmasi Password Baru"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Ulangi password baru"
          />

          <div className="flex justify-end pt-4 border-t border-white/10">
            <Button 
                type="submit" 
                isLoading={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg shadow-red-900/20 hover:shadow-red-900/40 transition-all"
            >
              Simpan Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

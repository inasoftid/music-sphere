import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/5 text-center p-8">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500/20 mb-6 animate-bounce">
          <svg className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2">Berhasil!</h1>
        <p className="text-gray-400 mb-8">
          Pembayaran Anda telah diproses dan jadwal kursus Anda telah dikonfirmasi.
        </p>

        <div className="space-y-3">
          <Link href="/dashboard" className="block">
            <Button fullWidth>
              Ke Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/courses" className="block">
             <Button fullWidth variant="outline">
               Jelajahi Kursus Lain
             </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

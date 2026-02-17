'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: Record<string, unknown>) => void;
        onPending: (result: Record<string, unknown>) => void;
        onError: (result: Record<string, unknown>) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billId = searchParams.get('billId');

  const [status, setStatus] = useState<'loading' | 'ready' | 'pending' | 'success' | 'failed' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [billData, setBillData] = useState<{ amount: number; courseName: string } | null>(null);

  // Load Midtrans Snap script
  useEffect(() => {
    const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
    const snapUrl = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';

    // Check if script already loaded
    if (document.querySelector(`script[src="${snapUrl}"]`)) return;

    const script = document.createElement('script');
    script.src = snapUrl;
    script.setAttribute('data-client-key', midtransClientKey || '');
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Don't remove on cleanup to avoid re-loading
    };
  }, []);

  // Fetch bill data
  useEffect(() => {
    if (!billId) {
      setStatus('error');
      setErrorMessage('Bill ID tidak ditemukan. Silakan kembali ke halaman billing.');
      return;
    }

    const fetchBill = async () => {
      try {
        const res = await fetch(`/api/payments/status?billId=${billId}`);
        const data = await res.json();

        if (data.status === 'paid') {
          setStatus('success');
          return;
        }

        // Fetch bill details for display
        const billRes = await fetch(`/api/bills?billId=${billId}`);
        if (billRes.ok) {
          const billDetail = await billRes.json();
          setBillData(billDetail);
        }

        setStatus('ready');
      } catch {
        setStatus('error');
        setErrorMessage('Gagal memuat data pembayaran.');
      }
    };

    fetchBill();
  }, [billId]);

  const handlePay = useCallback(async () => {
    if (!billId) return;
    setIsProcessing(true);

    try {
      // Create transaction and get Snap token
      const res = await fetch('/api/payments/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal membuat transaksi');
      }

      const { token } = await res.json();

      // Open Midtrans Snap popup
      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: () => {
            setStatus('success');
            setTimeout(() => {
              router.push('/dashboard/payment/success');
            }, 1500);
          },
          onPending: () => {
            setStatus('pending');
          },
          onError: () => {
            setStatus('failed');
          },
          onClose: () => {
            // User closed popup without completing payment
            setIsProcessing(false);
          },
        });
      } else {
        throw new Error('Midtrans Snap belum dimuat. Silakan refresh halaman.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsProcessing(false);
    }
  }, [billId, router]);

  const checkPaymentStatus = async () => {
    if (!billId) return;

    try {
      const res = await fetch(`/api/payments/status?billId=${billId}`);
      const data = await res.json();

      if (data.status === 'paid') {
        setStatus('success');
        setTimeout(() => {
          router.push('/dashboard/payment/success');
        }, 1500);
      } else if (data.status === 'expired') {
        setStatus('ready'); // Allow retry
        setErrorMessage('Transaksi sebelumnya sudah expired. Silakan bayar ulang.');
      }
    } catch {
      // Silently fail
    }
  };

  if (status === 'loading') {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/5 text-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/5 text-center p-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-4">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-400 mb-6">{errorMessage}</p>
          <Button onClick={() => router.push('/dashboard/billing')} variant="outline">
            Kembali ke Billing
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="max-w-xl mx-auto py-12">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/5 text-center p-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-4">
            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">Pembayaran Berhasil!</h3>
          <p className="text-gray-400 mt-2">Pendaftaran kursus Anda telah dikonfirmasi.</p>
          <p className="text-sm text-gray-500 mt-2">Mengalihkan ke halaman sukses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-white">Pembayaran</h1>
        <p className="text-gray-400">Selesaikan pembayaran untuk mendaftar kursus.</p>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        <div className="space-y-6 p-6">
          {/* Bill Summary */}
          {billData && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Ringkasan Pembayaran</h3>
              <p className="text-lg font-semibold text-white mt-1">{billData.courseName}</p>
              <p className="text-2xl font-bold text-red-400 mt-2">
                Rp {billData.amount.toLocaleString('id-ID')}
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <p className="text-sm text-yellow-400">{errorMessage}</p>
            </div>
          )}

          {/* Payment Methods Info */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm text-gray-500 mb-3">Metode pembayaran yang tersedia:</p>
            <div className="flex flex-wrap gap-2">
              {['GoPay', 'ShopeePay', 'BCA VA', 'BNI VA', 'BRI VA', 'Mandiri', 'QRIS', 'Kartu Kredit'].map((method) => (
                <span key={method} className="px-3 py-1 bg-gray-700/50 rounded-full text-xs font-medium text-gray-300">
                  {method}
                </span>
              ))}
            </div>
          </div>

          {/* Pay Button */}
          {status === 'ready' && (
            <Button
              fullWidth
              size="lg"
              onClick={handlePay}
              isLoading={isProcessing}
            >
              Bayar Sekarang
            </Button>
          )}

          {/* Pending Status */}
          {status === 'pending' && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto"></div>
              <p className="text-gray-300">Menunggu pembayaran Anda...</p>
              <p className="text-sm text-gray-500">Silakan selesaikan pembayaran sesuai instruksi.</p>
              <button
                onClick={checkPaymentStatus}
                className="text-sm text-red-400 hover:text-red-300 flex items-center mx-auto"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Cek Status Pembayaran
              </button>
            </div>
          )}

          {/* Failed Status */}
          {status === 'failed' && (
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Pembayaran Gagal</h3>
              <p className="text-gray-400">Silakan coba lagi.</p>
              <Button onClick={handlePay} variant="outline">
                Coba Lagi
              </Button>
            </div>
          )}

          <p className="text-xs text-center text-gray-500">
            Pembayaran diproses secara aman melalui Midtrans.
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => router.push('/dashboard/billing')}
          className="text-sm text-gray-500 hover:text-gray-300"
        >
          Kembali ke Billing
        </button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Memuat...</p>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

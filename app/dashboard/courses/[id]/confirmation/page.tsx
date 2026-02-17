'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

// Mapping endTime dari startTime
const TIME_SLOT_MAP: Record<string, string> = {
  '11:00': '11:45',
  '12:00': '12:45',
  '13:00': '13:45',
  '14:00': '14:45',
  '15:00': '15:45',
  '16:00': '16:45',
  '17:00': '17:45',
};

interface CourseData {
  id: string;
  title: string;
  registrationFee: number;
  monthlyFee: number;
  mentorName: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const courseId = params.id as string;
  const day = searchParams.get('day') || '';
  const startTime = searchParams.get('startTime') || '';
  const endTime = TIME_SLOT_MAP[startTime] || '';

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/available-schedules?courseId=${courseId}`);
        if (res.ok) {
          const data = await res.json();
          setCourseData(data.course);
        }
      } catch {
        console.error('Error fetching course data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleProceedPayment = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!day || !startTime) {
      setError('Data jadwal tidak lengkap. Silakan pilih jadwal kembali.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId,
          day,
          startTime,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/payment?billId=${data.billId}`);
      } else {
        const errData = await res.json();
        setError(errData.message || 'Gagal memproses pendaftaran');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const registrationFee = courseData?.registrationFee || 200000;
  const monthlyFee = courseData?.monthlyFee || 350000;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20">
          <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-3 text-2xl font-bold text-white">Konfirmasi Pendaftaran</h2>
        <p className="mt-2 text-gray-400">Periksa detail Anda sebelum melanjutkan ke pembayaran.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-medium text-white">Detail Kursus</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nama Kursus</dt>
                <dd className="mt-1 text-sm text-white">{courseData?.title || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Mentor</dt>
                <dd className="mt-1 text-sm text-white">{courseData?.mentorName || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Jadwal</dt>
                <dd className="mt-1 text-sm text-white">
                  {day}, {startTime} - {endTime}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Durasi Kursus</dt>
                <dd className="mt-1 text-sm text-white">24 pertemuan (1x/minggu)</dd>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white">Ringkasan Pembayaran</h3>
            <dl className="mt-3 space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-400">Biaya Pendaftaran (Pembayaran Pertama)</dt>
                <dd className="text-sm font-medium text-white">Rp {registrationFee.toLocaleString('id-ID')}</dd>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10">
                <dt className="text-base font-bold text-white">Total Pembayaran Sekarang</dt>
                <dd className="text-base font-bold text-red-400">Rp {registrationFee.toLocaleString('id-ID')}</dd>
              </div>
            </dl>

            <div className="mt-4 bg-gray-900/50 rounded-lg p-4 border border-white/5">
              <p className="text-xs text-gray-400">
                <span className="text-yellow-400 font-medium">Info Biaya Bulanan:</span> Setelah pendaftaran, biaya bulanan sebesar{' '}
                <span className="text-white font-medium">Rp {monthlyFee.toLocaleString('id-ID')}</span>/bulan
                akan ditagihkan setiap tanggal 1 dan wajib dibayar paling lambat tanggal 10.
                Keterlambatan pembayaran dikenakan denda Rp 5.000.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button fullWidth size="lg" onClick={handleProceedPayment} isLoading={isSubmitting}>
              Lanjutkan ke Pembayaran
            </Button>
            <p className="mt-2 text-xs text-center text-gray-500">
              Tempat Anda akan direservasi selama pembayaran berlangsung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}

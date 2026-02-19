'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ScheduleSelector } from '@/components/scheduling/ScheduleSelector';
import { useAuth } from '@/context/AuthContext';

interface SlotData {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  mentorName: string;
}

interface ScheduleInfo {
  id: string;
  courseName: string;
  courseId: string;
  dayOfWeek: string;
  time: string;
  status: string;
}

function RescheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const scheduleId = searchParams.get('scheduleId') || '';

  const [slots, setSlots] = useState<SlotData[]>([]);
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!scheduleId || !user?.id) return;

    const fetchData = async () => {
      try {
        // Ambil data jadwal user
        const schedRes = await fetch(`/api/schedules?userId=${user.id}`);
        if (schedRes.ok) {
          const schedules = await schedRes.json();
          const found = schedules.find((s: ScheduleInfo) => s.id === scheduleId);
          if (found) {
            setScheduleInfo(found);

            // Ambil available slots berdasarkan courseId
            const slotsRes = await fetch(`/api/available-schedules?courseId=${found.courseId}`);
            if (slotsRes.ok) {
              const data = await slotsRes.json();
              setSlots(data.slots || []);
            } else {
              setError('Gagal memuat slot jadwal yang tersedia.');
            }
          } else {
            setError('Jadwal tidak ditemukan.');
          }
        } else {
          setError('Gagal memuat data jadwal.');
        }
      } catch {
        setError('Terjadi kesalahan saat memuat data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [scheduleId, user]);

  const handleConfirm = async (day: string, startTime: string) => {
    if (!scheduleId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/schedules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId,
          status: 'pending_change',
          requestedDay: day,
          requestedTime: startTime,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Permintaan perubahan jadwal berhasil dikirim! Menunggu persetujuan admin.');
        setTimeout(() => {
          router.push('/dashboard/schedule');
        }, 2000);
      } else {
        const errData = await res.json();
        setError(errData.message || 'Gagal mengirim permintaan perubahan jadwal.');
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

  if (error && !scheduleInfo) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => router.push('/dashboard/schedule')}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Kembali ke Jadwal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/dashboard/schedule')}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/80 border border-white/10 hover:bg-gray-700/80 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Ajukan Perubahan Jadwal</h1>
          {scheduleInfo && (
            <div className="mt-1 space-y-0.5">
              <p className="text-gray-400">
                Kursus: <span className="text-white font-medium">{scheduleInfo.courseName}</span>
              </p>
              <p className="text-gray-400">
                Jadwal saat ini:{' '}
                <span className="text-yellow-400 font-medium">
                  {scheduleInfo.dayOfWeek}, {scheduleInfo.time}
                </span>
              </p>
              <p className="text-gray-500 text-sm">
                Pilih hari dan waktu baru. Permintaan akan dikirim ke admin untuk persetujuan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-green-400 text-sm">{successMsg}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Schedule Selector */}
      {!successMsg && (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {isSubmitting ? (
            <div className="flex items-center justify-center py-12 gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
              <span className="text-gray-400">Mengirim permintaan...</span>
            </div>
          ) : slots.length > 0 ? (
            <ScheduleSelector slots={slots} onConfirm={handleConfirm} />
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 text-center">
              <p className="text-yellow-400">Tidak ada slot jadwal yang tersedia saat ini.</p>
              <button
                onClick={() => router.push('/dashboard/schedule')}
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Kembali
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReschedulePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      }
    >
      <RescheduleContent />
    </Suspense>
  );
}

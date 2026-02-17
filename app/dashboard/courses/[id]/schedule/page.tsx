'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ScheduleSelector } from '@/components/scheduling/ScheduleSelector';

interface SlotData {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  mentorName: string;
}

interface CourseInfo {
  id: string;
  title: string;
  registrationFee: number;
  monthlyFee: number;
  mentorName: string;
}

export default function SchedulePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const [slots, setSlots] = useState<SlotData[]>([]);
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch(`/api/available-schedules?courseId=${courseId}`);
        if (res.ok) {
          const data = await res.json();
          setSlots(data.slots);
          setCourseInfo(data.course);
        } else {
          const err = await res.json();
          setError(err.message || 'Gagal memuat jadwal');
        }
      } catch {
        setError('Terjadi kesalahan saat memuat jadwal');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [courseId]);

  const handleConfirm = (day: string, startTime: string) => {
    router.push(
      `/dashboard/courses/${courseId}/confirmation?day=${encodeURIComponent(day)}&startTime=${encodeURIComponent(startTime)}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-white mb-2">Pilih Jadwal</h1>
        {courseInfo && (
          <div className="space-y-1">
            <p className="text-gray-400">
              Kursus: <span className="text-white font-medium">{courseInfo.title}</span>
            </p>
            <p className="text-gray-400">
              Mentor: <span className="text-white font-medium">{courseInfo.mentorName}</span>
            </p>
            <p className="text-gray-500 text-sm">
              Pilih hari dan waktu yang sesuai untuk sesi mingguan Anda (45 menit per sesi).
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <ScheduleSelector
          slots={slots}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}

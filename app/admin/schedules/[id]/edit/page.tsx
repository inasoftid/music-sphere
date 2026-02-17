'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const TIME_SLOTS = [
  { startTime: '11:00', endTime: '11:45', label: '11:00 - 11:45' },
  { startTime: '12:00', endTime: '12:45', label: '12:00 - 12:45' },
  { startTime: '13:00', endTime: '13:45', label: '13:00 - 13:45' },
  { startTime: '14:00', endTime: '14:45', label: '14:00 - 14:45' },
  { startTime: '15:00', endTime: '15:45', label: '15:00 - 15:45' },
  { startTime: '16:00', endTime: '16:45', label: '16:00 - 16:45' },
  { startTime: '17:00', endTime: '17:45', label: '17:00 - 17:45' },
];

const ROOMS = ['Studio 1', 'Studio 2', 'Studio 3'];

interface ScheduleData {
  id: string;
  courseId: string;
  mentorId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  status: string;
  course: { id: string; title: string };
  mentor: { id: string; name: string; expertise: string };
  student: { id: string; name: string; email: string } | null;
}

export default function EditSchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [formData, setFormData] = useState({
    day: '',
    startTime: '',
    room: '',
    status: 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`/api/admin/schedules/${id}`);
        if (res.ok) {
          const data: ScheduleData = await res.json();
          setSchedule(data);
          setFormData({
            day: data.day,
            startTime: data.startTime,
            room: data.room,
            status: data.status,
          });
        } else {
          alert('Jadwal tidak ditemukan');
          router.push('/admin/schedules');
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
        alert('Gagal memuat jadwal');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [id, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.startTime) newErrors.startTime = 'Pilih waktu';
    if (!formData.room) newErrors.room = 'Pilih ruangan';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setSubmitError('');

    try {
      const response = await fetch(`/api/admin/schedules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: formData.day,
          startTime: formData.startTime,
          room: formData.room,
          status: formData.status,
        }),
      });

      if (response.ok) {
        router.push('/admin/schedules');
      } else {
        const error = await response.json();
        setSubmitError(error.error || 'Gagal mengupdate jadwal');
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      setSubmitError('Terjadi kesalahan saat mengupdate jadwal');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!schedule) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/schedules')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Jadwal</h1>
          <p className="text-sm text-gray-500 mt-1">Ubah jadwal untuk {schedule.student?.name || 'siswa'}</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Info Siswa (Read-only) */}
          {schedule.student && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Siswa</label>
              <div className="text-gray-900 font-medium">{schedule.student.name}</div>
              <div className="text-gray-500 text-sm">{schedule.student.email}</div>
            </div>
          )}

          {/* Info Kursus & Mentor (Read-only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kursus</label>
              <div className="text-gray-900 font-medium">{schedule.course.title}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mentor</label>
              <div className="text-gray-900 font-medium">{schedule.mentor.name}</div>
              <div className="text-gray-500 text-sm">{schedule.mentor.expertise}</div>
            </div>
          </div>

          {/* Day Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hari <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Waktu <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.startTime ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih waktu</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot.startTime} value={slot.startTime}>
                  {slot.label} (45 menit)
                </option>
              ))}
            </select>
            {errors.startTime && <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>}
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ruangan <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.room ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih ruangan</option>
              {ROOMS.map((room) => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
            {errors.room && <p className="mt-1 text-sm text-red-500">{errors.room}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Aktif</option>
              <option value="cancelled">Dibatalkan</option>
              <option value="completed">Selesai</option>
            </select>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/admin/schedules')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              <Save size={18} />
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

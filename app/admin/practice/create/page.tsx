'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';

interface CourseOption {
  id: string;
  title: string;
  description: string;
}

export default function CreatePracticePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    thumbnailUrl: '',
    videoUrl: '',
    duration: '00:00', // Default duration since we can't reliably get it without API key
    courseId: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/admin/courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const videoId = getYouTubeVideoId(url);
    
    setForm(prev => ({
      ...prev,
      videoUrl: url,
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : prev.thumbnailUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/admin/practice');
      } else {
        const data = await res.json();
        alert(data.message || 'Gagal menyimpan');
      }
    } catch (error) {
      console.error('Error creating practice content:', error);
      alert('Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Konten Practice</h1>
        <p className="text-gray-600 text-sm mt-1">Tambahkan video latihan baru untuk siswa</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kursus *</label>
            <select
              required
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Pilih Kursus</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Video *</label>
            <input
              type="text"
              required
              placeholder="Contoh: Latihan Dasar Piano - Scales C Mayor"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Video (YouTube) *</label>
            <input
              type="url"
              required
              placeholder="https://www.youtube.com/watch?v=..."
              value={form.videoUrl}
              onChange={handleVideoUrlChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Thumbnail akan diambil otomatis dari YouTube.
            </p>
          </div>

          {/* Auto-Generated Thumbnail Preview */}
          {form.thumbnailUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preview Thumbnail</label>
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative group">
                <img 
                  src={form.thumbnailUrl} 
                  alt="Thumbnail Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to hqdefault if maxresdefault doesn't exist
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('maxresdefault')) {
                        target.src = target.src.replace('maxresdefault', 'hqdefault');
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-medium">Otomatis dari YouTube</p>
                </div>
              </div>
            </div>
          )}

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Durasi Video</label>
            <input
              type="text"
              placeholder="Contoh: 10:05"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Masukkan durasi manual jika tidak otomatis (Format MM:SS).
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-2.5 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors border border-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

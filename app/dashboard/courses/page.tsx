'use client';

import React, { useEffect, useState } from 'react';
import { CourseCard } from '@/components/courses/CourseCard';
import { Course } from '@/types';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface EnrolledCourse {
  id: string;
  status: string;
  totalSessions: number;
  completedSessions: number;
  scheduleId: string | null;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    image: string | null;
    mentorName: string;
    expertise: string;
  };
}

export default function CoursesPage() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'enrolled' | 'browse'>('enrolled');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        // Fetch enrolled courses
        const enrollRes = await fetch(`/api/enrollments?userId=${user.id}`);
        if (enrollRes.ok) {
          const data = await enrollRes.json();
          setEnrolledCourses(data);
        }

        // Fetch all available courses
        const coursesRes = await fetch('/api/courses');
        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setAvailableCourses(data);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Gagal memuat data kursus. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    );
  }

  // Filter out courses that student is already enrolled in
  const enrolledCourseIds = enrolledCourses.map((e) => e.course.id);
  const browsableCourses = availableCourses.filter((c) => !enrolledCourseIds.includes(c.id));

  const statusLabel: Record<string, { text: string; color: string }> = {
    active: { text: 'Aktif', color: 'bg-green-500/20 text-green-400 border-green-500/20' },
    pending_payment: { text: 'Menunggu Pembayaran', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' },
    completed: { text: 'Selesai', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
    cancelled: { text: 'Dibatalkan', color: 'bg-red-500/20 text-red-400 border-red-500/20' },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Kursus Saya</h1>
        <p className="mt-2 text-gray-400">Kelola kursus Anda atau temukan kursus baru</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-0">
        <button
          onClick={() => setActiveTab('enrolled')}
          className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'enrolled'
              ? 'text-red-400 border-red-500'
              : 'text-gray-400 border-transparent hover:text-white hover:border-white/20'
          }`}
        >
          Kursus Terdaftar ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'browse'
              ? 'text-red-400 border-red-500'
              : 'text-gray-400 border-transparent hover:text-white hover:border-white/20'
          }`}
        >
          Cari Kursus Baru ({browsableCourses.length})
        </button>
      </div>

      {/* Enrolled Courses Tab */}
      {activeTab === 'enrolled' && (
        <div>
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((enrollment) => {
                const status = statusLabel[enrollment.status] || statusLabel.active;
                const progress = enrollment.totalSessions > 0
                  ? Math.round((enrollment.completedSessions / enrollment.totalSessions) * 100)
                  : 0;

                return (
                  <div
                    key={enrollment.id}
                    className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/5 overflow-hidden hover:border-red-500/50 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-44 w-full bg-gray-900 overflow-hidden">
                      {enrollment.course.image ? (
                        <img
                          src={enrollment.course.image}
                          alt={enrollment.course.title}
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl opacity-20">🎵</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-1">{enrollment.course.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Mentor: {enrollment.course.mentorName}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                          <span>Pertemuan</span>
                          <span>{enrollment.completedSessions}/{enrollment.totalSessions}</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Link href={`/dashboard/courses/${enrollment.course.id}`}>
                          <button className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-red-600 hover:border-red-600 text-white rounded-lg text-sm font-medium transition-all duration-300">
                            Lihat Detail
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-5 border border-white/5">
                <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg mb-2">Anda belum terdaftar di kursus apapun.</p>
              <p className="text-gray-500 text-sm mb-6">Temukan kursus yang sesuai dan mulai belajar musik!</p>
              <Button onClick={() => setActiveTab('browse')}>
                Cari Kursus
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Browse Courses Tab */}
      {activeTab === 'browse' && (
        <div>
          {browsableCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {browsableCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-5 border border-white/5">
                <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg">Anda sudah terdaftar di semua kursus yang tersedia!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

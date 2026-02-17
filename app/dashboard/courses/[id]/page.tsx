'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PracticeContent } from '@/types';
import { PracticeCard } from '@/components/practice/PracticeCard';
import { VideoModal } from '@/components/ui/VideoModal';

interface CourseData {
  id: string;
  title: string;
  description: string;
  image: string | null;
  registrationFee: number;
  monthlyFee: number;
  mentorId: string | null;
  mentor: { id: string; name: string; expertise: string } | null;
}

interface EnrollmentData {
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

interface ScheduleData {
  id: string;
  courseName: string;
  dayOfWeek: string;
  time: string;
  status: string;
  nextSessionDate: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [practiceContents, setPracticeContents] = useState<PracticeContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course detail
        const courseRes = await fetch(`/api/courses/${courseId}`);
        if (courseRes.ok) {
          const data = await courseRes.json();
          setCourse(data);
        }

        // If logged in, check enrollment
        if (user?.id) {
          const enrollRes = await fetch(`/api/enrollments?userId=${user.id}`);
          if (enrollRes.ok) {
            const enrollments: EnrollmentData[] = await enrollRes.json();
            const found = enrollments.find((e) => e.course.id === courseId);
            if (found) {
              setEnrollment(found);
            }
          }

          // Fetch schedules to find matching one
          const schedRes = await fetch(`/api/schedules?userId=${user.id}`);
          if (schedRes.ok) {
            const schedules: ScheduleData[] = await schedRes.json();
            const foundSched = schedules.find((s) => s.courseName === course?.title);
            if (foundSched) {
              setSchedule(foundSched);
            }
          }
        }

        // Fetch practice content for this course
        const practiceRes = await fetch(`/api/practice?courseId=${courseId}`);
        if (practiceRes.ok) {
          const data = await practiceRes.json();
          setPracticeContents(data);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId, user]);

  // Re-fetch schedule once course is loaded (to match by name)
  useEffect(() => {
    if (!course || !user?.id || schedule) return;

    const fetchSchedule = async () => {
      try {
        const schedRes = await fetch(`/api/schedules?userId=${user.id}`);
        if (schedRes.ok) {
          const schedules: ScheduleData[] = await schedRes.json();
          const foundSched = schedules.find((s) => s.courseName === course.title);
          if (foundSched) {
            setSchedule(foundSched);
          }
        }
      } catch {
        // silent
      }
    };

    fetchSchedule();
  }, [course, user, schedule]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Kursus tidak ditemukan.</p>
      </div>
    );
  }

  const isEnrolled = !!enrollment;

  // If student is enrolled, show training info
  if (isEnrolled) {
    return <EnrolledView course={course} enrollment={enrollment} schedule={schedule} practiceContents={practiceContents} />;
  }

  // If not enrolled, show course description + register button
  return <BrowseView course={course} />;
}

// ====== ENROLLED VIEW - Training List + Practice ======
function EnrolledView({
  course,
  enrollment,
  schedule,
  practiceContents,
}: {
  course: CourseData;
  enrollment: EnrollmentData;
  schedule: ScheduleData | null;
  practiceContents: PracticeContent[];
}) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'practice'>('sessions');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const totalSessions = enrollment.totalSessions;
  const completedSessions = enrollment.completedSessions;
  const progress = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  const statusLabel: Record<string, { text: string; color: string; bg: string }> = {
    active: { text: 'Aktif', color: 'text-green-400', bg: 'bg-green-500/20 border-green-500/20' },
    pending_payment: { text: 'Menunggu Pembayaran', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/20' },
    completed: { text: 'Selesai', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/20' },
    cancelled: { text: 'Dibatalkan', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/20' },
  };

  const currentStatus = statusLabel[enrollment.status] || statusLabel.active;

  // Generate session list
  const sessions = Array.from({ length: totalSessions }, (_, i) => {
    const sessionNum = i + 1;
    let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
    if (sessionNum <= completedSessions) {
      status = 'completed';
    } else if (sessionNum === completedSessions + 1) {
      status = 'current';
    }
    return { number: sessionNum, status };
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-white/10">
        {course.image ? (
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-6xl opacity-20">🎵</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent flex items-end">
          <div className="p-6 w-full">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${currentStatus.bg}`}>
              <span className={currentStatus.color}>{currentStatus.text}</span>
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{course.title}</h1>
            <p className="text-gray-400 mt-1">Mentor: {course.mentor?.name || enrollment.course.mentorName}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-500 rounded-full" />
              Progress Pelatihan
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeDasharray={`${progress}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{progress}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pertemuan selesai</span>
                  <span className="text-white font-medium">{completedSessions} dari {totalSessions}</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{totalSessions - completedSessions} pertemuan lagi</span>
                  <span>24 minggu total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Pertemuan / Materi Latihan */}
          <div className="flex gap-2 border-b border-white/10">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'sessions'
                  ? 'text-red-400 border-red-500'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-white/20'
              }`}
            >
              Daftar Pertemuan ({totalSessions})
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
                activeTab === 'practice'
                  ? 'text-red-400 border-red-500'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-white/20'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Materi Latihan ({practiceContents.length})
            </button>
          </div>

          {/* Tab Content: Sessions */}
          {activeTab === 'sessions' && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.number}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
                      session.status === 'completed'
                        ? 'bg-green-500/5 border-green-500/20'
                        : session.status === 'current'
                        ? 'bg-red-500/10 border-red-500/30 ring-1 ring-red-500/20'
                        : 'bg-gray-900/30 border-white/5'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        session.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : session.status === 'current'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {session.status === 'completed' ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        session.number
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${
                        session.status === 'completed' ? 'text-green-400' :
                        session.status === 'current' ? 'text-white' : 'text-gray-500'
                      }`}>
                        Pertemuan {session.number}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.status === 'completed'
                          ? 'Selesai'
                          : session.status === 'current'
                          ? 'Pertemuan selanjutnya'
                          : 'Belum dimulai'}
                      </p>
                    </div>
                    <div>
                      {session.status === 'current' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                          Selanjutnya
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Practice */}
          {activeTab === 'practice' && (
            <div>
              {practiceContents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {practiceContents.map((content) => (
                    <PracticeCard 
                      key={content.id} 
                      content={content} 
                      onClick={(url) => setSelectedVideo(url)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-1">Belum ada materi latihan untuk kursus ini.</p>
                  <p className="text-gray-500 text-sm">Video latihan akan segera ditambahkan.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule Info */}
          <div className="bg-gray-800/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Informasi Jadwal
            </h3>

            <div className="space-y-4">
              {schedule ? (
                <>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Hari & Waktu</p>
                    <p className="text-white font-medium">{schedule.dayOfWeek}, {schedule.time} WIB</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Sesi Berikutnya</p>
                    <p className="text-white font-medium">
                      {new Date(schedule.nextSessionDate).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-sm">Jadwal belum tersedia.</p>
              )}

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-1">Mentor</p>
                <p className="text-white font-medium">{course.mentor?.name || enrollment.course.mentorName}</p>
                <p className="text-xs text-gray-400">{course.mentor?.expertise || enrollment.course.expertise}</p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-1">Terdaftar Sejak</p>
                <p className="text-white font-medium">
                  {new Date(enrollment.enrolledAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link href="/dashboard/billing" className="block">
                <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all">
                  Lihat Tagihan
                </button>
              </Link>
              <Link href="/dashboard/schedule" className="block">
                <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all">
                  Lihat Jadwal
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <VideoModal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        videoUrl={selectedVideo || ''} 
      />
    </div>
  );
}

// ====== BROWSE VIEW - Course Description ======
function BrowseView({ course }: { course: CourseData }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-2xl shadow-red-900/20 border border-white/10">
        <img src={course.image || undefined} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex items-end">
          <div className="p-8 text-white w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{course.title}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-500 rounded-full" />
              Tentang Kursus
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed">
              {course.description}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-500 rounded-full" />
              Materi Pembelajaran
            </h2>
            <ul className="space-y-3 text-gray-300">
              {['Pengenalan Instrumen', 'Teori Dasar Musik', 'Latihan Teknik', 'Pengembangan Repertoar', 'Keterampilan Pertunjukan'].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-24 shadow-xl">
            <div className="space-y-6">
              <div className="text-center pb-6 border-b border-white/10">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Biaya Pendaftaran</p>
                    <p className="text-xl font-bold text-gray-300">Rp {course.registrationFee.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Biaya Bulanan</p>
                    <p className="text-3xl font-bold text-white">Rp {course.monthlyFee.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sertifikat
                  </span>
                  <span className="font-medium text-white">Ya</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Durasi
                  </span>
                  <span className="font-medium text-white">24 Pertemuan</span>
                </div>
                {course.mentor && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mentor
                    </span>
                    <span className="font-medium text-white">{course.mentor.name}</span>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Link href={`/dashboard/courses/${course.id}/schedule`} className="block">
                  <button className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/30 hover:scale-[1.02] active:scale-[0.98]">
                    Daftar Sekarang
                  </button>
                </Link>
                <p className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pembayaran aman via QRIS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

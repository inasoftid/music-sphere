'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, CreditCard, MessageSquare, Clock, ArrowRight } from 'lucide-react';

interface Enrollment {
  id: string;
  status: string;
  totalSessions: number;
  completedSessions: number;
  course: {
    id: string;
    title: string;
    mentorName: string;
    expertise: string;
  };
}

interface Schedule {
  id: string;
  courseName: string;
  dayOfWeek: string;
  time: string;
  status: string;
  nextSessionDate: string;
}

interface Bill {
  id: string;
  amount: number;
  month: string;
  status: string;
  dueDate: string;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      router.replace('/admin/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role === 'admin') return;

    const fetchData = async () => {
      try {
        const [enrollRes, scheduleRes, billRes] = await Promise.all([
          fetch(`/api/enrollments?userId=${user.id}`),
          fetch(`/api/schedules?userId=${user.id}`),
          fetch(`/api/bills?userId=${user.id}`),
        ]);

        if (enrollRes.ok) {
          const data = await enrollRes.json();
          setEnrollments(data.enrollments || data || []);
        }
        if (scheduleRes.ok) {
          const data = await scheduleRes.json();
          setSchedules(data.schedules || data || []);
        }
        if (billRes.ok) {
          const data = await billRes.json();
          setBills(data.bills || data || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (authLoading || (user?.role === 'admin')) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  const unpaidBills = bills.filter((b) => b.status === 'unpaid' || b.status === 'overdue');
  const upcomingSchedules = schedules.slice(0, 3);
  const activeCourses = enrollments.filter((e) => e.status === 'active' || e.status === 'pending_payment');

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-900/50 to-gray-900 border border-white/10 p-8">
        <div className="relative z-10">
           <h1 className="text-3xl font-bold text-white mb-2">
            Halo, <span className="text-red-500">{user?.name || 'Student'}</span>! 👋
          </h1>
          <p className="text-gray-400 text-lg">Selamat datang kembali di Music Sphere. Siap untuk belajar musik hari ini?</p>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-red-500/30 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <BookOpen className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{activeCourses.length}</p>
              <p className="text-sm text-gray-400 font-medium">Kursus Aktif</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Calendar className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{schedules.length}</p>
              <p className="text-sm text-gray-400 font-medium">Jadwal Minggu Ini</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-yellow-500/30 transition-all group">
           <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${unpaidBills.length > 0 ? 'bg-yellow-500/10 group-hover:bg-yellow-500/20' : 'bg-green-500/10 group-hover:bg-green-500/20'}`}>
              <CreditCard className={`w-7 h-7 ${unpaidBills.length > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{unpaidBills.length}</p>
              <p className="text-sm text-gray-400 font-medium">{unpaidBills.length > 0 ? 'Tagihan Belum Bayar' : 'Semua Lunas'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Schedule */}
        <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              Jadwal Mendatang
            </h2>
            <Link href="/dashboard/schedule" className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-700/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : upcomingSchedules.length > 0 ? (
              <div className="space-y-4">
                {upcomingSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center gap-4 p-4 bg-gray-900/50 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex flex-col items-center justify-center text-center border border-white/5">
                      <span className="text-xs text-gray-400 uppercase font-semibold">{schedule.dayOfWeek.slice(0, 3)}</span>
                      <span className="text-xs font-bold text-white">{schedule.time.split(' ')[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{schedule.courseName}</p>
                      <p className="text-sm text-gray-400">{schedule.dayOfWeek}, {schedule.time} WIB</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Calendar className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium">Belum ada jadwal minggu ini.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5">
             <h2 className="font-bold text-lg text-white flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Menu Cepat
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <Link href="/dashboard/courses" className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-white/5 hover:border-red-500/50 hover:bg-gray-900/80 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                 <span className="font-medium text-gray-200 group-hover:text-white transition-colors">Lihat Kursus Saya</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            </Link>

             <Link href="/dashboard/schedule" className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-white/5 hover:border-green-500/50 hover:bg-gray-900/80 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400 group-hover:text-green-300 group-hover:bg-green-500/20 transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                 <span className="font-medium text-gray-200 group-hover:text-white transition-colors">Jadwal Minggu Ini</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            </Link>

            <Link href="/dashboard/billing" className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-white/5 hover:border-yellow-500/50 hover:bg-gray-900/80 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-400 group-hover:text-yellow-300 group-hover:bg-yellow-500/20 transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                 <span className="font-medium text-gray-200 group-hover:text-white transition-colors">Info Tagihan</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            </Link>

            <Link href="/dashboard/chat" className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-white/5 hover:border-purple-500/50 hover:bg-gray-900/80 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-500/20 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                 <span className="font-medium text-gray-200 group-hover:text-white transition-colors">Chat dengan Admin</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

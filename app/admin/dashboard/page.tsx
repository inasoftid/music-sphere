'use client';

import React, { useEffect, useState } from 'react';
import { AdminStatsCard } from '@/components/admin/AdminStatsCard';
import Link from 'next/link';

interface RecentEnrollment {
  id: string;
  status: string;
  enrolledAt: string;
  user: { name: string; email: string };
  course: { title: string };
}

interface UpcomingSchedule {
  id: string;
  dayOfWeek: string;
  time: string;
  nextSessionDate: string;
  user: { name: string };
  course: { title: string };
}

interface RecentPayment {
  id: string;
  amount: number;
  month: string;
  status: string;
  paymentDate: string;
  user: { name: string; email: string };
}

interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  unpaidBills: number;
  overdueBills: number;
  recentEnrollments: RecentEnrollment[];
  upcomingSchedules: UpcomingSchedule[];
  recentPayments: RecentPayment[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="w-16 h-6 bg-gray-200 rounded-full" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="w-20 h-7 bg-gray-200 rounded" />
                <div className="w-28 h-4 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
        {/* Skeleton cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="w-40 h-5 bg-gray-200 rounded" />
              </div>
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-14 bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Gagal memuat data dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Ringkasan data Music Sphere</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <AdminStatsCard
          title="Total Siswa"
          value={stats.totalStudents}
          iconBg="bg-blue-50 text-blue-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          }
        />
        <AdminStatsCard
          title="Total Kursus"
          value={stats.activeCourses}
          iconBg="bg-purple-50 text-purple-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          }
        />
        <AdminStatsCard
          title="Pendapatan"
          value={formatCurrency(stats.totalRevenue)}
          trend="Total"
          trendUp={true}
          iconBg="bg-green-50 text-green-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
          }
        />
        <AdminStatsCard
          title="Tagihan Belum Bayar"
          value={stats.unpaidBills + stats.overdueBills}
          trend={stats.overdueBills > 0 ? `${stats.overdueBills} jatuh tempo` : 'Semua lancar'}
          trendUp={stats.overdueBills === 0}
          iconBg="bg-orange-50 text-orange-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          }
        />
      </div>

      {/* Middle Row: Upcoming Schedule + Enrollment Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Upcoming Schedule - wider */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Jadwal Mendatang</h2>
            <Link href="/admin/schedules" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="p-6">
            {stats.upcomingSchedules.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingSchedules.map((schedule) => {
                  const sessionDate = new Date(schedule.nextSessionDate);
                  const day = sessionDate.toLocaleDateString('id-ID', { weekday: 'short' });
                  const dateNum = sessionDate.getDate();
                  const month = sessionDate.toLocaleDateString('id-ID', { month: 'short' });
                  return (
                    <div key={schedule.id} className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-indigo-50 rounded-xl flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-indigo-400 uppercase">{day}</span>
                        <span className="text-lg font-bold text-indigo-600 leading-none">{dateNum}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{schedule.course.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {schedule.dayOfWeek}, {schedule.time} &middot; {schedule.user.name}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                        {dateNum} {month}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <p className="text-sm text-gray-400">Belum ada jadwal mendatang.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Ringkasan</h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Enrollment stat */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Enrollment Aktif</span>
                <span className="text-sm font-bold text-gray-900">{stats.totalEnrollments}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.totalEnrollments / (stats.totalStudents * stats.activeCourses || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Paid vs Unpaid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Tagihan Terbayar</span>
                <span className="text-sm font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Unpaid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Belum Dibayar</span>
                <span className="text-sm font-bold text-orange-600">{stats.unpaidBills} tagihan</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full"
                  style={{ width: `${Math.min((stats.unpaidBills / ((stats.unpaidBills + stats.overdueBills) || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Overdue */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Jatuh Tempo</span>
                <span className="text-sm font-bold text-red-600">{stats.overdueBills} tagihan</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full"
                  style={{ width: `${Math.min((stats.overdueBills / ((stats.unpaidBills + stats.overdueBills) || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enrollments Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Pendaftaran Terbaru</h2>
          <Link href="/admin/students" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Siswa</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kursus</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentEnrollments.length > 0 ? (
                stats.recentEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-indigo-600">
                            {getInitials(enrollment.user.name)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{enrollment.user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{enrollment.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{enrollment.course.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">{formatDate(enrollment.enrolledAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${
                          enrollment.status === 'active'
                            ? 'bg-green-50 text-green-700'
                            : enrollment.status === 'completed'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {enrollment.status === 'active'
                          ? 'Aktif'
                          : enrollment.status === 'completed'
                          ? 'Selesai'
                          : 'Dibatalkan'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-400">
                    Belum ada data pendaftaran.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Pembayaran Terbaru</h2>
          <Link href="/admin/payments" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Siswa</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulan</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Bayar</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentPayments.length > 0 ? (
                stats.recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-green-600">
                            {getInitials(payment.user.name)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{payment.user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{payment.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{payment.month}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {payment.paymentDate ? formatDate(payment.paymentDate) : '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700">
                        Lunas
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                    Belum ada data pembayaran.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

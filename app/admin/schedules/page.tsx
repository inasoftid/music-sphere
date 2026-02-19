'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

interface Schedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  status: string;
  course: {
    id: string;
    title: string;
  };
  mentor: {
    id: string;
    name: string;
    expertise: string;
  };
  student: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const DAY_ORDER: Record<string, number> = {
  'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6,
};

export default function AdminSchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/admin/schedules');
      if (res.ok) {
        const data = await res.json();
        // Sort by day order then time
        data.sort((a: Schedule, b: Schedule) => {
          const dayDiff = (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99);
          if (dayDiff !== 0) return dayDiff;
          return a.startTime.localeCompare(b.startTime);
        });
        setSchedules(data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Filter schedules
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch =
      schedule.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (schedule.student?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    const matchesDay = dayFilter === 'all' || schedule.day === dayFilter;

    return matchesSearch && matchesStatus && matchesDay;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSchedules.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentSchedules = filteredSchedules.slice(startIndex, endIndex);

  const handleEditSchedule = (schedule: Schedule) => {
    router.push(`/admin/schedules/${schedule.id}/edit`);
  };

  const handleDeleteSchedule = async () => {
    if (!selectedSchedule) return;

    try {
      const res = await fetch(`/api/admin/schedules/${selectedSchedule.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsDeleteModalOpen(false);
        setSelectedSchedule(null);
        fetchSchedules();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete schedule');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('An error occurred while deleting schedule');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Kursus</h1>
          <p className="text-sm text-gray-500 mt-1">
            Jadwal dibuat otomatis saat siswa mendaftar kursus. Anda dapat mengubah atau menghapus jadwal di sini.
          </p>
        </div>
      </div>

      <Card>
        {/* Search and Filter Bar */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Show</label>
            <select
              value={entriesPerPage}
              onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <label className="text-sm text-gray-600">entries</label>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={dayFilter}
              onChange={(e) => { setDayFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Hari</option>
              <option value="Senin">Senin</option>
              <option value="Selasa">Selasa</option>
              <option value="Rabu">Rabu</option>
              <option value="Kamis">Kamis</option>
              <option value="Jumat">Jumat</option>
              <option value="Sabtu">Sabtu</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Siswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Kursus & Mentor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Hari & Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSchedules.length > 0 ? (
                currentSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                    {/* Student */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {schedule.student ? (
                        <>
                          <div className="text-sm font-medium text-gray-900">{schedule.student.name}</div>
                          <div className="text-sm text-gray-500">{schedule.student.email}</div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Belum ada siswa</span>
                      )}
                    </td>

                    {/* Course & Mentor */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-indigo-600">{schedule.course.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Mentor: {schedule.mentor.name}
                      </div>
                    </td>

                    {/* Day & Time */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-900">{schedule.day}</span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock size={14} />
                          <span>{schedule.startTime} - {schedule.endTime}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        schedule.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : schedule.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {schedule.status === 'active' ? 'Aktif' : schedule.status === 'cancelled' ? 'Dibatalkan' : 'Selesai'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditSchedule(schedule)}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar size={48} className="text-gray-400" />
                      <div className="text-gray-500 font-medium">Belum ada jadwal</div>
                      <div className="text-gray-400 text-sm">Jadwal akan muncul saat siswa mendaftar kursus</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredSchedules.length)} dari {filteredSchedules.length} jadwal
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Jadwal</h3>
            <p className="text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus jadwal <strong>{selectedSchedule?.course.title}</strong> ({selectedSchedule?.day}, {selectedSchedule?.startTime})?
              {selectedSchedule?.student && (
                <> Siswa <strong>{selectedSchedule.student.name}</strong> akan kehilangan jadwal ini.</>
              )}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedSchedule(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSchedule}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

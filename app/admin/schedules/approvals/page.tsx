'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Search, CheckCircle, XCircle, Clock, ArrowRight, RefreshCw } from 'lucide-react';

interface RescheduleRequest {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  courseName: string;
  mentorName: string;
  currentDay: string;
  currentStartTime: string;
  currentEndTime: string;
  requestedDay: string;
  requestedTime: string;
  enrolledAt: string;
}

export default function RescheduleApprovalsPage() {
  const [requests, setRequests] = useState<RescheduleRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/reschedule-approvals');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (enrollmentId: string, action: 'approve' | 'reject') => {
    setProcessingId(enrollmentId);
    try {
      const res = await fetch('/api/admin/reschedule-approvals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, action }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast(data.message, 'success');
        fetchRequests(); // Refresh list
      } else {
        showToast(data.message || 'Terjadi kesalahan', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const q = searchTerm.toLowerCase();
    return (
      req.student.name.toLowerCase().includes(q) ||
      req.student.email.toLowerCase().includes(q) ||
      req.courseName.toLowerCase().includes(q) ||
      req.requestedDay.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approval Perubahan Jadwal</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tinjau dan setujui atau tolak permintaan perubahan jadwal dari siswa.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {requests.length > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full border border-yellow-200">
              <Clock size={14} />
              {requests.length} Permintaan Pending
            </span>
          )}
          <button
            onClick={fetchRequests}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
          ) : (
            <XCircle size={18} className="text-red-600 flex-shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      <Card>
        {/* Search bar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari siswa, kursus, atau hari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <span className="text-sm text-gray-500">
            {filteredRequests.length} permintaan ditemukan
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-gray-500">Memuat data...</div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <p className="text-gray-600 font-medium">Tidak ada permintaan pending</p>
            <p className="text-gray-400 text-sm">Semua permintaan perubahan jadwal telah ditangani.</p>
          </div>
        ) : (
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
                    Jadwal Saat Ini
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Perubahan Diajukan
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    {/* Student */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                          {req.student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{req.student.name}</div>
                          <div className="text-xs text-gray-500">{req.student.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Course & Mentor */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-indigo-600">{req.courseName}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Mentor: {req.mentorName}</div>
                    </td>

                    {/* Current Schedule */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="font-medium">{req.currentDay}</span>
                        <span className="text-gray-400">•</span>
                        <span>{req.currentStartTime} - {req.currentEndTime}</span>
                      </div>
                    </td>

                    {/* Requested Change */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ArrowRight size={14} className="text-yellow-500 flex-shrink-0" />
                        <div className="flex items-center gap-2 text-sm font-semibold text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                          <span>{req.requestedDay}</span>
                          <span className="text-yellow-400">•</span>
                          <span>{req.requestedTime}</span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAction(req.id, 'approve')}
                          disabled={processingId === req.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <CheckCircle size={14} />
                          {processingId === req.id ? 'Memproses...' : 'Setujui'}
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'reject')}
                          disabled={processingId === req.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-red-200"
                        >
                          <XCircle size={14} />
                          Tolak
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

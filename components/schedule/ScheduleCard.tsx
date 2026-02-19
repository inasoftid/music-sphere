import React from 'react';
import { useRouter } from 'next/navigation';
import { StudentSchedule } from '@/types';

interface ScheduleCardProps {
  schedule: StudentSchedule;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule }) => {
  const router = useRouter();

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border border-green-500/20',
    pending_change: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20',
    cancelled: 'bg-red-500/20 text-red-400 border border-red-500/20',
  };

  const isPendingChange = schedule.status === 'pending_change';

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/5 hover:border-white/10 transition-colors overflow-hidden">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white">{schedule.courseName}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-2 ${statusColors[schedule.status]}`}>
              {schedule.status === 'active'
                ? 'Aktif'
                : schedule.status === 'pending_change'
                ? 'Menunggu Persetujuan Perubahan'
                : 'Dibatalkan'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Sesi Berikutnya</p>
            <p className="text-base font-bold text-white">
              {new Date(schedule.nextSessionDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Info */}
      {isPendingChange && schedule.requestedDay && schedule.requestedTime ? (
        /* Tampilan perbandingan jadwal lama vs baru */
        <div className="mx-6 mb-6 rounded-xl overflow-hidden border border-white/10">
          {/* Jadwal Aktif */}
          <div className="bg-white/5 px-5 py-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Jadwal Saat Ini</p>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{schedule.dayOfWeek}, {schedule.time}</span>
            </div>
          </div>

          {/* Divider dengan arrow */}
          <div className="flex items-center gap-3 bg-yellow-500/5 border-t border-b border-yellow-500/20 px-5 py-2">
            <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-xs text-yellow-400 font-medium">Perubahan diajukan — menunggu persetujuan admin</span>
          </div>

          {/* Jadwal yang Diajukan */}
          <div className="bg-yellow-500/5 px-5 py-4">
            <p className="text-xs font-semibold text-yellow-500 uppercase tracking-wider mb-2">Jadwal Diajukan</p>
            <div className="flex items-center gap-2 text-yellow-300">
              <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">{schedule.requestedDay}, {schedule.requestedTime}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Tampilan normal jadwal aktif */
        <div className="border-t border-white/10 flex flex-col sm:flex-row justify-between items-center bg-white/5 px-6 py-4">
          <div className="flex items-center text-gray-300 mb-3 sm:mb-0">
            <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{schedule.dayOfWeek}, {schedule.time}</span>
          </div>

          {schedule.status === 'active' && (
            <button
              onClick={() => router.push(`/dashboard/schedule/reschedule?scheduleId=${schedule.id}`)}
              className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors border border-gray-600 hover:border-gray-500"
            >
              Ajukan Perubahan Jadwal
            </button>
          )}
        </div>
      )}
    </div>
  );
};


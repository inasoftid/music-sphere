import React, { useState } from 'react';
import { StudentSchedule } from '@/types';
import { Button } from '@/components/ui/Button';
import { RescheduleModal } from './RescheduleModal';

interface ScheduleCardProps {
  schedule: StudentSchedule;
  onRescheduleRequest: (scheduleId: string, day: string, time: string) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, onRescheduleRequest }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRescheduleSubmit = (day: string, time: string) => {
    onRescheduleRequest(schedule.id, day, time);
    setIsModalOpen(false);
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border border-green-500/20',
    pending_change: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20',
    cancelled: 'bg-red-500/20 text-red-400 border border-red-500/20',
  };

  return (
    <>
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/5 p-6 hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">{schedule.courseName}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-2 ${statusColors[schedule.status]}`}>
              {schedule.status === 'active' ? 'Aktif' : schedule.status === 'pending_change' ? 'Menunggu Perubahan' : 'Dibatalkan'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Sesi Berikutnya</p>
            <p className="text-lg font-bold text-white">
              {new Date(schedule.nextSessionDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center bg-white/5 -mx-6 -mb-6 p-6 mt-4">
          <div className="flex items-center text-gray-300 mb-4 sm:mb-0">
            <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{schedule.dayOfWeek}, {schedule.time}</span>
          </div>

          {schedule.status === 'active' && (
            <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors border border-gray-600 hover:border-gray-500"
            >
              Ajukan Perubahan Jadwal
            </button>
          )}
        </div>
      </div>

      <RescheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRescheduleSubmit}
        currentDay={schedule.dayOfWeek}
        currentTime={schedule.time}
      />
    </>
  );
};

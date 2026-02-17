'use client';

import React, { useState } from 'react';
import { TimeSlot } from './TimeSlot';
import { Button } from '@/components/ui/Button';

interface SlotData {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  mentorName: string;
}

interface ScheduleSelectorProps {
  slots: SlotData[];
  onConfirm: (day: string, startTime: string) => void;
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  slots,
  onConfirm,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('Senin');
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; startTime: string } | null>(null);

  // Filter slots untuk hari yang dipilih
  const slotsForDay = slots.filter(s => s.day === selectedDay);

  // Hitung jumlah slot tersedia per hari
  const availableCountByDay = DAYS.reduce((acc, day) => {
    acc[day] = slots.filter(s => s.day === day && s.isAvailable).length;
    return acc;
  }, {} as Record<string, number>);

  const handleConfirm = () => {
    if (selectedSlot) {
      onConfirm(selectedSlot.day, selectedSlot.startTime);
    }
  };

  const handleSelectSlot = (day: string, startTime: string) => {
    setSelectedSlot({ day, startTime });
  };

  return (
    <div className="space-y-8">
      {/* Day Selection */}
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-3">Pilih Hari</h4>
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => {
                setSelectedDay(day);
                setSelectedSlot(null);
              }}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-lg relative
                ${selectedDay === day
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-red-900/30 ring-2 ring-red-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-white/5'
                }`}
            >
              {day}
              <span className={`ml-1.5 text-xs ${selectedDay === day ? 'text-red-200' : 'text-gray-500'}`}>
                ({availableCountByDay[day]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots grid */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Waktu Tersedia - {selectedDay}
        </h4>
        {slotsForDay.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {slotsForDay.map(slot => (
              <TimeSlot
                key={`${slot.day}-${slot.startTime}`}
                startTime={slot.startTime}
                endTime={slot.endTime}
                isAvailable={slot.isAvailable}
                isSelected={
                  selectedSlot?.day === slot.day &&
                  selectedSlot?.startTime === slot.startTime
                }
                onSelect={() => handleSelectSlot(slot.day, slot.startTime)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center py-8">Tidak ada slot untuk hari ini.</p>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-800 border border-white/10"></div>
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-600"></div>
          <span>Dipilih</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-900/30 opacity-50"></div>
          <span>Sudah Dibooking</span>
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex justify-end">
        <Button
          onClick={handleConfirm}
          disabled={!selectedSlot}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Konfirmasi Jadwal
        </Button>
      </div>
    </div>
  );
};

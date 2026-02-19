'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ScheduleSelector } from '@/components/scheduling/ScheduleSelector';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (day: string, time: string) => void;
  currentDay: string;
  currentTime: string;
  courseId?: string;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentDay,
  currentTime,
  courseId,
}) => {
  const [slots, setSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !courseId) return;
    
    setIsLoading(true);
    setError(null);
    
    fetch(`/api/available-schedules?courseId=${courseId}`)
      .then(res => res.json())
      .then(data => {
        setSlots(data.slots || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching schedule slots:', err);
        setError('Gagal memuat slot jadwal');
        setIsLoading(false);
      });
  }, [isOpen, courseId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-gray-900 border border-white/10 rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-8 max-h-[90vh] overflow-y-auto">
          <div className="w-full">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-white mb-2" id="modal-title">
                Ajukan Perubahan Jadwal
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Pilih hari dan waktu baru yang tersedia. Permintaan akan dikirim ke admin untuk persetujuan.
              </p>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-400">Memuat slot jadwal...</div>
                </div>
              ) : error ? (
                <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">
                  {error}
                </div>
              ) : slots.length > 0 ? (
                <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
                  <ScheduleSelector
                    slots={slots}
                    onConfirm={(day, startTime) => {
                      onSubmit(day, startTime);
                      onClose();
                    }}
                  />
                </div>
              ) : (
                <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 p-4 rounded-lg mb-6">
                  Tidak ada slot jadwal yang tersedia saat ini.
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white hover:border-gray-500">
                  Batal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

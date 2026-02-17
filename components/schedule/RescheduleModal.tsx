'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (day: string, time: string) => void;
  currentDay: string;
  currentTime: string;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentDay,
  currentTime,
}) => {
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedTime, setSelectedTime] = useState(currentTime);

  if (!isOpen) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const times = ['09:00 - 10:30', '11:00 - 12:30', '14:00 - 15:30', '16:00 - 17:30'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedDay, selectedTime);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-gray-900 border border-white/10 rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-8">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-xl leading-6 font-bold text-white" id="modal-title">
                Request Schedule Change
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-400 mb-6">
                  Select a new time for your class. This request will be sent to admin for approval.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Day</label>
                    <div className="relative">
                        <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="block w-full pl-4 pr-10 py-3 text-base bg-gray-800/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg text-white appearance-none transition-shadow"
                        >
                        {days.map(day => (
                            <option key={day} value={day} className="bg-gray-900">{day}</option>
                        ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                     <div className="relative">
                        <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                         className="block w-full pl-4 pr-10 py-3 text-base bg-gray-800/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg text-white appearance-none transition-shadow"
                        >
                        {times.map(time => (
                            <option key={time} value={time} className="bg-gray-900">{time}</option>
                        ))}
                        </select>
                         <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                  </div>

                  <div className="mt-8 sm:flex sm:flex-row-reverse gap-3">
                    <Button type="submit" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20">
                      Submit Request
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose} className="mt-3 w-full sm:mt-0 sm:w-auto border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white hover:border-gray-500">
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

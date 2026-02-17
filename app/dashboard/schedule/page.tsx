'use client';

import React, { useState, useEffect } from 'react';
import { ScheduleCard } from '@/components/schedule/ScheduleCard';
import { StudentSchedule } from '@/types';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function SchedulePage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<StudentSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
        if (!user?.id) return;
        
        try {
            const res = await fetch(`/api/schedules?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setSchedules(data);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.id) {
        fetchSchedules();
    } else {
        setIsLoading(false);
    }
  }, [user]);

  const handleRescheduleRequest = async (scheduleId: string, day: string, time: string) => {
    try {
        const res = await fetch('/api/schedules', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                scheduleId,
                status: 'pending_change',
                // In a real app we might store requested changes in a separate table/field
                // For now just updating status to show UI change
            })
        });

        if (res.ok) {
            setSchedules(prev => prev.map(s => 
              s.id === scheduleId ? { ...s, status: 'pending_change' } : s
            ));
            alert('Reschedule request sent! Waiting for admin approval.');
        } else {
            alert('Failed to send request');
        }
    } catch (error) {
        console.error('Error requesting reschedule:', error);
        alert('An error occurred');
    }
  };

  if (isLoading) {
      return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Jadwal Kelas Saya</h1>
        <p className="text-gray-400">Lihat kelas aktif Anda dan sesi mendatang.</p>
      </div>

      <div className="space-y-4">
        {schedules.map(schedule => (
          <ScheduleCard 
            key={schedule.id} 
            schedule={schedule} 
            onRescheduleRequest={handleRescheduleRequest}
          />
        ))}
        
        {schedules.length === 0 && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="text-gray-400">
                    Anda belum memiliki jadwal aktif. 
                    <br />
                    Daftar kursus untuk memulai!
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

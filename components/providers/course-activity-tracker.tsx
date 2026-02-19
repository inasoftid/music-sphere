'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export function CourseActivityTracker() {
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;

    const updateActivity = async () => {
      try {
        await fetch('/api/user/activity', { method: 'POST' });
      } catch (error) {
        console.error('Failed to update activity:', error);
      }
    };

    // Update immediately on mount/route change
    updateActivity();

    // Update every 5 minutes
    const interval = setInterval(updateActivity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, pathname]);

  return null;
}

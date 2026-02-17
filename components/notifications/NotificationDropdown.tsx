'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/types';

// Mock Data
const STUDENT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Schedule Confirmed',
    message: 'Your Piano Pop Mastery class scheduled for Monday has been confirmed.',
    type: 'success',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    link: '/dashboard/schedule',
  },
  {
    id: '2',
    title: 'Payment Reminder',
    message: 'Your monthly bill for October is due in 3 days.',
    type: 'warning',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: false,
    link: '/dashboard/billing',
  },
  {
    id: '3',
    title: 'New Course Available',
    message: 'Check out our new Drumming Essentials course!',
    type: 'info',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    isRead: true,
    link: '/dashboard/courses',
  },
];

const ADMIN_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Student Registration',
    message: 'Budi Santoso has registered for Guitar Basics.',
    type: 'info',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isRead: false,
    link: '/admin/students',
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Payment of Rp 350.000 received from Siti Aminah.',
    type: 'success',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isRead: false,
    link: '/admin/payments',
  },
  {
    id: '3',
    title: 'Schedule Conflict',
    message: 'Room A is double booked on Monday, 10:00 AM.',
    type: 'error',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    isRead: true,
    link: '/admin/schedules',
  },
];

export const NotificationDropdown: React.FC<{ theme?: 'light' | 'dark', role?: 'admin' | 'student' }> = ({ theme = 'dark', role = 'student' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(role === 'admin' ? ADMIN_NOTIFICATIONS : STUDENT_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const isLight = theme === 'light';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors focus:outline-none relative ${
          isLight 
            ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <span className="sr-only">View notifications</span>
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white shadow-sm" />
        )}
      </button>

      {isOpen && (
        <div className={`origin-top-right absolute right-0 mt-3 w-80 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden ${
          isLight 
            ? 'bg-white border border-gray-100' 
            : 'bg-gray-900/95 backdrop-blur-xl border border-white/10'
        }`}>
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className={`px-4 py-3 border-b flex justify-between items-center ${
              isLight ? 'border-gray-100 bg-gray-50' : 'border-white/5 bg-white/5'
            }`}>
              <h3 className={`text-sm font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification.id)}
                    theme={theme}
                  />
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No notifications
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

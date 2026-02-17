import React from 'react';
import Link from 'next/link';
import { Notification } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  theme?: 'light' | 'dark';
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick, theme = 'dark' }) => {
  const isLight = theme === 'light';
  
  const iconColors = {
    info: isLight ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400',
    success: isLight ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-green-400',
    warning: isLight ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-500/20 text-yellow-400',
    error: isLight ? 'bg-red-100 text-red-600' : 'bg-red-500/20 text-red-400',
  };

  const icons = {
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const content = (
    <div 
      className={`p-4 border-b flex items-start space-x-3 transition-colors cursor-pointer ${
        isLight 
          ? `border-gray-100 hover:bg-gray-50 ${!notification.isRead ? 'bg-indigo-50/50' : ''}`
          : `border-white/5 hover:bg-white/5 ${!notification.isRead ? 'bg-red-500/5' : ''}`
      }`}
      onClick={onClick}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${iconColors[notification.type]}`}>
        {icons[notification.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${
          isLight 
            ? (!notification.isRead ? 'text-gray-900' : 'text-gray-600')
            : (!notification.isRead ? 'text-white' : 'text-gray-400')
        }`}>
          {notification.title}
        </p>
        <p className={`text-sm line-clamp-2 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
          {notification.message}
        </p>
        <p className={`text-xs mt-1 ${isLight ? 'text-gray-400' : 'text-gray-500'}`}>
          {new Date(notification.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {!notification.isRead && (
        <div className="flex-shrink-0 self-center">
          <span className={`block w-2 h-2 rounded-full shadow-lg ${
            isLight
              ? 'bg-indigo-500 ring-2 ring-white shadow-indigo-500/30'
              : 'bg-red-500 ring-2 ring-gray-900 shadow-red-500/50'
          }`}></span>
        </div>
      )}
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link} className="block">{content}</Link>;
  }

  return <div className="block">{content}</div>;
};

import React from 'react';
import { User } from '@/types';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/5 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-red-600/20 transition-colors duration-500"></div>
      
      <div className="relative h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-800 shadow-xl overflow-hidden">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          <span className="bg-gradient-to-br from-red-500 to-red-700 bg-clip-text text-transparent">
            {user.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      <div className="text-center sm:text-left flex-1 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
        <p className="text-gray-400 text-sm mb-3 flex items-center justify-center sm:justify-start gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            {user.email}
        </p>
        <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-red-600 text-white shadow-lg shadow-red-900/20">
          Student
        </div>
      </div>
    </div>
  );
};

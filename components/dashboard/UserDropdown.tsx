'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Lock, ChevronDown } from 'lucide-react';

export const UserDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 group focus:outline-none"
      >
        <div className="hidden sm:flex flex-col items-end mr-1">
            <span className="text-sm font-semibold text-white tracking-wide group-hover:text-red-400 transition-colors">
                {user.name}
            </span>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                Student
            </span>
        </div>
        <div className="h-10 w-10 p-0.5 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-900/20 group-hover:shadow-red-900/40 transition-all">
            <div className="h-full w-full rounded-full bg-gray-900 flex items-center justify-center border-2 border-transparent">
                <span className="text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                </span>
            </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-3 w-64 rounded-xl shadow-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 ring-1 ring-black ring-opacity-50 focus:outline-none z-50 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 bg-white/5">
              <p className="text-sm text-white font-bold truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
          </div>
          
          <div className="py-2">
            <Link
              href="/dashboard/profile"
              className="px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 group"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
              Profil Saya
            </Link>
            
            <Link
              href="/dashboard/profile/change-password"
              className="px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3 group"
              onClick={() => setIsOpen(false)}
            >
              <Lock className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
              Ubah Password
            </Link>
            
            <div className="my-2 border-t border-white/5"></div>

            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

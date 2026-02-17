'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { UserDropdown } from '@/components/dashboard/UserDropdown';

export const DashboardNavbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    if (path !== '/dashboard' && pathname?.startsWith(path)) {
      return true;
    }
    return false;
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/courses', label: 'Kursus Saya' },
    { href: '/dashboard/schedule', label: 'Jadwal' },
    { href: '/dashboard/billing', label: 'Tagihan' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-gray-900/80 backdrop-blur-md border-b border-white/10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 14.79s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <Link href="/dashboard" className="font-bold text-xl text-white tracking-tight hover:opacity-90 transition-opacity">
                Music<span className="text-red-500">Sphere</span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'border-red-500 text-white'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex-shrink-0">
                <NotificationDropdown role="student" />
              </div>
            <div className="ml-3 relative flex items-center gap-3">
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

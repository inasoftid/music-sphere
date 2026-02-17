'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // mobile: drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);
  // desktop: sidebar visible or collapsed
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const handleToggle = () => {
    // On lg+, toggle collapse. On mobile, toggle drawer.
    if (window.innerWidth >= 1024) {
      setDesktopCollapsed((prev) => !prev);
    } else {
      setMobileOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <AdminSidebar
        mobileOpen={mobileOpen}
        desktopCollapsed={desktopCollapsed}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Content wrapper - shifts right when sidebar visible on desktop */}
      <div
        className={`transition-all duration-300 ${
          desktopCollapsed ? 'lg:ml-0' : 'lg:ml-70'
        }`}
      >
        <AdminHeader onToggleSidebar={handleToggle} />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

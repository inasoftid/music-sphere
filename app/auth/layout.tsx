import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
      <LandingNavbar />
      
      <main className="flex-grow flex flex-col justify-center py-20 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
           {/* Logo/Title is in Navbar, but we can verify if we want it here too. 
               The prompt asks for "desainnya sama kan dengan style home". 
               So removing the duplicate header is cleaner. */}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {children}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

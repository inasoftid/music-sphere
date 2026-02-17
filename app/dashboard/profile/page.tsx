'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { User, StudentProfile } from '@/types';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
        if (!user?.id) return;
        
        try {
            const res = await fetch(`/api/profile?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setProfileData(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (user?.id) {
        fetchProfile();
    } else {
        setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
      return <div>Loading...</div>;
  }

  // Fallback if no data or error
  const displayUser = profileData || {
    ...user,
    profile: {} // Empty profile fallback
  };

  const formatDate = (dateString: string) => {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Profil Saya</h1>
        <Link href="/dashboard/profile/edit">
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 hover:bg-white/5">
            Edit Profil
          </Button>
        </Link>
      </div>

      <ProfileHeader user={displayUser} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-500 rounded-full"></span>
              Informasi Pribadi
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-400">Nama Lengkap</dt>
              <dd className="mt-1 text-sm text-white font-medium">{displayUser.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Email</dt>
              <dd className="mt-1 text-sm text-white font-medium">{displayUser.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Alamat</dt>
              <dd className="mt-1 text-sm text-white font-medium">{displayUser.profile?.address || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-400">Tanggal Lahir</dt>
              <dd className="mt-1 text-sm text-white font-medium">{formatDate(displayUser.profile?.dateOfBirth)}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-500 rounded-full"></span>
              Informasi Kursus
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-400">Instrumen Pilihan</dt>
              <dd className="mt-2 text-sm text-white">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/20">
                  {displayUser.profile?.instrument || 'Belum Dipilih'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

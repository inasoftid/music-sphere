'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Card } from '@/components/ui/Card';
import { StudentProfile } from '@/types';

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<Partial<StudentProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
        if (!user?.id) return;
        
        try {
            const res = await fetch(`/api/profile?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setProfileData(data.profile || {});
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

  const handleSubmit = async (data: StudentProfile) => {
    setIsSaving(true);
    try {
        const res = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                userId: user?.id,
            })
        });

        if (res.ok) {
            router.push('/dashboard/profile');
        } else {
            console.error('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
      return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <h1 className="text-2xl font-bold text-white">Edit Profil</h1>
      </div>
      
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/5 rounded-xl p-6">
        <ProfileForm 
            initialData={profileData} 
            onSubmit={handleSubmit}
            isLoading={isSaving}
        />
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StudentProfile } from '@/types';

interface ProfileFormProps {
  initialData?: Partial<StudentProfile>;
  onSubmit: (data: StudentProfile) => void;
  isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<StudentProfile>({
    userId: '',
    address: '',
    dateOfBirth: '',
    instrument: '',
    ...initialData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Alamat Lengkap"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Contoh: Jl. Mawar No. 123"
        required
      />

      <Input
        label="Tanggal Lahir"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
      />

      <div className="mb-4">
        <label htmlFor="instrument" className="block text-sm font-medium text-gray-300 mb-1.5">
          Minat Instrumen
        </label>
        <div className="relative">
            <select
              id="instrument"
              name="instrument"
              value={formData.instrument}
              onChange={handleChange}
              className="block w-full rounded-lg border border-white/10 bg-gray-900/50 text-white shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 sm:text-sm appearance-none cursor-pointer hover:border-white/20 transition-colors"
              required
            >
              <option value="" className="bg-gray-900 text-gray-500">Pilih instrumen...</option>
              <option value="Piano Pop" className="bg-gray-900">Piano Pop</option>
              <option value="Vokal" className="bg-gray-900">Vokal</option>
              <option value="Guitar" className="bg-gray-900">Gitar</option>
              <option value="Ukulele" className="bg-gray-900">Ukulele</option>
              <option value="Drum" className="bg-gray-900">Drum</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-white/10">
        <Button type="submit" isLoading={isLoading} className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg shadow-lg shadow-red-900/20 hover:shadow-red-900/40 transition-all">
          Simpan Profil
        </Button>
      </div>
    </form>
  );
};

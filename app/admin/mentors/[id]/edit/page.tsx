'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  expertise: string;
  photo?: string;
  bio?: string;
  status: string;
}

export default function EditMentorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expertise: '',
    bio: '',
    status: 'active',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [currentPhoto, setCurrentPhoto] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const res = await fetch(`/api/admin/mentors/${id}`);
        if (res.ok) {
          const mentor: Mentor = await res.json();
          setFormData({
            name: mentor.name,
            email: mentor.email,
            phone: mentor.phone || '',
            expertise: mentor.expertise,
            bio: mentor.bio || '',
            status: mentor.status,
          });
          setCurrentPhoto(mentor.photo || '');
          setPhotoPreview(mentor.photo || '');
        } else {
          alert('Mentor not found');
          router.push('/admin/mentors');
        }
      } catch (error) {
        console.error('Error fetching mentor:', error);
        alert('Failed to load mentor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentor();
  }, [id, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.expertise.trim()) {
      newErrors.expertise = 'Expertise is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(currentPhoto);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSaving(true);

    try {
      let photoUrl = currentPhoto;

      // Upload new photo if selected
      if (photoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', photoFile);

        const uploadRes = await fetch('/api/upload/image', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          photoUrl = uploadData.imageUrl;
        } else {
          const error = await uploadRes.json();
          alert(error.error || 'Failed to upload photo');
          setIsSaving(false);
          return;
        }
      }

      // Update mentor
      const response = await fetch(`/api/admin/mentors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          photo: photoUrl,
        }),
      });

      if (response.ok) {
        router.push('/admin/mentors');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update mentor');
      }
    } catch (error) {
      console.error('Error updating mentor:', error);
      alert('An error occurred while updating mentor');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading mentor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/mentors')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Mentor</h1>
          <p className="text-sm text-gray-500 mt-1">Update mentor information</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Photo
            </label>
            
            {!photoPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload size={40} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload photo
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative w-32 h-32">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full border-4 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-600">
                    {photoFile?.name || 'Current photo'}
                  </p>
                  <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors text-sm">
                    <Upload size={16} />
                    <span>Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="mentor@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+62 812 3456 7890"
              />
            </div>
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expertise <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.expertise ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Piano, Guitar, Vocal"
            />
            {errors.expertise && (
              <p className="mt-1 text-sm text-red-500">{errors.expertise}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tell us about the mentor's background and experience..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/admin/mentors')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Update Mentor'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Upload, X } from 'lucide-react';

export default function CreateCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    registrationFee: '',
    monthlyFee: '',
    mentorId: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mentors, setMentors] = useState<{ id: string; name: string }[]>([]);

  React.useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch('/api/admin/mentors');
        if (res.ok) {
          const data = await res.json();
          // Filter only active mentors if needed, or just take all
          setMentors(data);
        }
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };
    fetchMentors();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.mentorId) {
      newErrors.mentorId = 'Mentor is required';
    }

    if (!formData.registrationFee) {
      newErrors.registrationFee = 'Registration fee is required';
    } else if (Number(formData.registrationFee) < 0) {
      newErrors.registrationFee = 'Fee must be 0 or positive';
    }

    if (!formData.monthlyFee) {
      newErrors.monthlyFee = 'Monthly fee is required';
    } else if (Number(formData.monthlyFee) < 0) {
        newErrors.monthlyFee = 'Fee must be 0 or positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // Upload image first if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.imageUrl;
        } else {
          const error = await uploadRes.json();
          alert(error.error || 'Failed to upload image');
          setIsSubmitting(false);
          return;
        }
      }

      // Create course with image URL
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          registrationFee: Number(formData.registrationFee),
          monthlyFee: Number(formData.monthlyFee),
          image: imageUrl,
          mentorId: formData.mentorId,
        }),
      });

      if (response.ok) {
        router.push('/admin/courses');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('An error occurred while creating the course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Course</h1>
      </div>

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Piano Pop Mastery"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the course content and objectives..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Mentor Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mentor <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.mentorId}
              onChange={(e) => setFormData({ ...formData, mentorId: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.mentorId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name}
                </option>
              ))}
            </select>
            {errors.mentorId && (
              <p className="mt-1 text-sm text-red-500">{errors.mentorId}</p>
            )}
            {mentors.length === 0 && (
              <p className="mt-1 text-xs text-orange-500">
                No mentors found. Please create a mentor first.
              </p>
            )}
          </div>

          {/* Duration and Price */}
          {/* Price */}
          {/* Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Registration Fee (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.registrationFee}
                onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.registrationFee ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.registrationFee && (
                <p className="mt-1 text-sm text-red-500">{errors.registrationFee}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Fee (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.monthlyFee ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="500000"
                min="0"
              />
              {errors.monthlyFee && (
                <p className="mt-1 text-sm text-red-500">{errors.monthlyFee}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course Image
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload size={40} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WebP up to 5MB
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {imageFile?.name}
                  </p>
                  <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors text-sm">
                    <Upload size={16} />
                    <span>Change Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

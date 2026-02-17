'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  instrument: string;
}

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: StudentData | null;
  onSuccess: () => void;
  viewOnly?: boolean;
}

export default function StudentFormModal({ 
  isOpen, 
  onClose, 
  student, 
  onSuccess,
  viewOnly = false
}: StudentFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    instrument: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!student && !viewOnly;
  const isViewMode = viewOnly;
  const isAddMode = !student && !viewOnly;

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        instrument: student.instrument || '-',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        instrument: '',
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.instrument.trim()) {
      newErrors.instrument = 'Instrument is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const url = isAddMode
        ? '/api/admin/students'
        : `/api/admin/students/${student?.id}`;
      const method = isAddMode ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          instrument: formData.instrument,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save student');
      }
    } catch (error) {
      console.error('Error saving student:', error);
      alert('An error occurred while saving the student');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isViewMode ? 'View Student' : isAddMode ? 'Add New Student' : 'Edit Student'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isViewMode}
              className={`w-full px-4 py-2 border text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-700 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isViewMode}
              className={`w-full px-4 py-2 border  text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-700 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="student@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isViewMode}
              className={`w-full px-4 py-2 border text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-700 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+62 812 3456 7890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Instrument */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instrument <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.instrument}
              onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
              disabled={isViewMode}
              className={`w-full px-4 py-2 border rounded-lg  text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-700 ${
                errors.instrument ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select an instrument</option>
              <option value="Piano">Piano</option>
              <option value="Guitar">Guitar</option>
              <option value="Vocal">Vocal</option>
              <option value="Violin">Violin</option>
              <option value="Drum">Drum</option>
              <option value="Bass">Bass</option>
              <option value="Keyboard">Keyboard</option>
              <option value="Flute">Flute</option>
            </select>
            {errors.instrument && (
              <p className="mt-1 text-sm text-red-500">{errors.instrument}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : isAddMode
                  ? 'Add Student'
                  : 'Update Student'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

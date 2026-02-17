'use client';

import React from 'react';
import { X, Users, Clock, DollarSign, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  registrationFee: number;
  monthlyFee: number;
  image?: string;
  activeStudents: number;
  status: string;
}

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export default function CourseDetailModal({ isOpen, onClose, course }: CourseDetailModalProps) {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Course Image */}
          {course.image && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Course Image</h3>
              <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-600" />
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}


            {/* Fees */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign size={24} className="text-green-600" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Registration Fee</p>
                    <p className="text-lg font-bold text-gray-900">Rp {course.registrationFee.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Fee</p>
                    <p className="text-lg font-bold text-gray-900">Rp {course.monthlyFee.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enrolled Students */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Enrolled Students</p>
                  <p className="text-xl font-bold text-gray-900">{course.activeStudents} students</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-semibold text-gray-700">Course Status</span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              course.status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {course.status}
            </span>
          </div>

          {/* Course ID */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Course ID: <span className="font-mono text-gray-700">{course.id}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface StudentDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
  onSuccess: () => void;
}

export default function StudentDeleteModal({ 
  isOpen, 
  onClose, 
  studentName, 
  studentId, 
  onSuccess 
}: StudentDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/students/${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('An error occurred while deleting the student');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertTriangle className="text-red-600" size={24} />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Delete Student
          </h3>

          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold">{studentName}</span>? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

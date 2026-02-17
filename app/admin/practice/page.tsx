'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Trash2, Plus, Search, ChevronLeft, ChevronRight, AlertTriangle, X } from 'lucide-react';

interface PracticeItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  courseId: string;
  courseName: string;
  createdAt: string;
}

export default function AdminPracticePage() {
  const router = useRouter();
  const [contents, setContents] = useState<PracticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchContents = async () => {
    try {
      const res = await fetch('/api/admin/practice');
      if (res.ok) {
        const data = await res.json();
        setContents(data);
      }
    } catch (error) {
      console.error('Error fetching practice content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/practice?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setContents((prev) => prev.filter((c) => c.id !== deleteId));
        setDeleteId(null);
      } else {
          alert('Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('An error occurred while deleting content');
    } finally {
        setIsDeleting(false);
    }
  };

  const filtered = contents.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginated = filtered.slice(startIndex, startIndex + entriesPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
         <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const handleDeleteClick = (id: string) => {
      setDeleteId(id);
  };

  const selectedTitle = contents.find(c => c.id === deleteId)?.title;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Materi Practice</h1>
          <p className="text-gray-600 text-sm mt-1">Kelola konten video latihan untuk siswa</p>
        </div>
        <button
          onClick={() => router.push('/admin/practice/create')}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Konten
        </button>
      </div>

      <Card>
        {/* Search */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span>entries</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul atau kursus..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Thumbnail</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Judul</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kursus</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Durasi</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900">{startIndex + index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="w-20 h-12 rounded overflow-hidden bg-gray-200">
                      <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900 font-medium truncate max-w-[250px]">{item.title}</p>
                    <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline truncate block max-w-[250px]">
                      {item.videoUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium border border-indigo-100">
                      {item.courseName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.duration}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                     <div className="flex flex-col items-center gap-2">
                        <div className="text-gray-400 text-4xl">📹</div>
                        <div className="text-gray-500 font-medium">Belum ada konten practice</div>
                         {searchTerm && <div className="text-gray-400 text-sm">Coba kata kunci lain</div>}
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal (Styled like DeleteConfirmModal) */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
               <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Hapus Konten</h2>
              </div>
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                 <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
             <div className="p-6">
              <p className="text-gray-600 mb-4">
                Apakah Anda yakin ingin menghapus konten ini?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                 <p className="text-sm font-semibold text-red-900 mb-1">
                  {selectedTitle}
                </p>
                <p className="text-xs text-red-700">
                  Tindakan ini tidak dapat dibatalkan. Data akan dihapus permanen.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

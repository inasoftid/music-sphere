'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { FileText, Download, ChevronDown } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  mentor: { name: string } | null;
}

interface Student {
  no: number;
  id: string;
  name: string;
  email: string;
  instrument: string;
  status: string;
  enrolledAt: string;
  completedSessions: number;
  totalSessions: number;
}

interface SelectedCourse {
  id: string;
  title: string;
  mentor: { name: string; expertise: string } | null;
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Aktif',
  pending_payment: 'Menunggu Pembayaran',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

// Kolom tabel: [header, lebar dalam mm]
const COLUMNS: [string, number][] = [
  ['No', 10],
  ['Nama Siswa', 42],
  ['Email', 50],
  ['Instrumen', 22],
  ['Status', 28],
  ['Tgl. Daftar', 18],
  ['Sesi', 10],
]; // total = 180mm (A4 210 - margin 15*2)

export default function AdminReportsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<SelectedCourse | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/admin/reports/students');
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleGenerate = async () => {
    if (!selectedCourseId) return;
    setIsLoading(true);
    setHasFetched(false);
    try {
      const res = await fetch(`/api/admin/reports/students?courseId=${selectedCourseId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCourse(data.course);
        setStudents(data.students);
        setHasFetched(true);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!selectedCourse) return;
    setIsPdfLoading(true);
    try {
      const { jsPDF } = await import('jspdf');

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();   // 210
      const pageH = pdf.internal.pageSize.getHeight();  // 297
      const margin = 15;
      const contentW = pageW - margin * 2; // 180

      const today = new Date().toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric',
      });

      // ── Header (indigo background) ──────────────────────────────
      pdf.setFillColor(67, 56, 202); // indigo-700
      pdf.rect(0, 0, pageW, 48, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Music Sphere', margin, 16);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(199, 210, 254); // indigo-200
      pdf.text('Lembaga Kursus Musik', margin, 22);

      // Garis pemisah di dalam header
      pdf.setDrawColor(99, 102, 241); // indigo-500
      pdf.setLineWidth(0.3);
      pdf.line(margin, 27, pageW - margin, 27);

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Laporan Daftar Siswa', margin, 35);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(199, 210, 254);
      pdf.text(`Per Kursus  —  Dicetak pada ${today}`, margin, 42);

      // ── Info Kursus ─────────────────────────────────────────────
      pdf.setFillColor(249, 250, 251); // gray-50
      pdf.rect(0, 48, pageW, 24, 'F');
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.2);
      pdf.line(0, 72, pageW, 72);

      const col3 = contentW / 3;
      const infoLabels = ['Nama Kursus', 'Mentor', 'Total Siswa'];
      const infoValues = [
        selectedCourse.title,
        selectedCourse.mentor?.name || '-',
        `${students.length} siswa`,
      ];

      infoLabels.forEach((label, i) => {
        const x = margin + col3 * i;
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(107, 114, 128); // gray-500
        pdf.text(label, x, 57);

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(17, 24, 39); // gray-900
        // Potong teks jika terlalu panjang
        const maxW = col3 - 4;
        const truncated = pdf.splitTextToSize(infoValues[i], maxW)[0];
        pdf.text(truncated, x, 65);
      });

      // ── Header Tabel ────────────────────────────────────────────
      let y = 72;
      const rowH = 8;
      const headerH = 9;

      pdf.setFillColor(243, 244, 246); // gray-100
      pdf.rect(0, y, pageW, headerH, 'F');

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(75, 85, 99); // gray-600

      let x = margin;
      COLUMNS.forEach(([label, w]) => {
        pdf.text(label.toUpperCase(), x + 1.5, y + 6.5);
        x += w;
      });

      y += headerH;

      // ── Baris Data ───────────────────────────────────────────────
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');

      students.forEach((student, idx) => {
        // Tambah halaman baru jika melebihi batas
        if (y + rowH > pageH - margin) {
          pdf.addPage();
          y = margin;

          // Ulangi header tabel di halaman baru
          pdf.setFillColor(243, 244, 246);
          pdf.rect(0, y, pageW, headerH, 'F');
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(75, 85, 99);
          let hx = margin;
          COLUMNS.forEach(([label, w]) => {
            pdf.text(label.toUpperCase(), hx + 1.5, y + 6.5);
            hx += w;
          });
          y += headerH;
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
        }

        // Warna baris selang-seling
        if (idx % 2 === 0) {
          pdf.setFillColor(255, 255, 255);
        } else {
          pdf.setFillColor(249, 250, 251);
        }
        pdf.rect(0, y, pageW, rowH, 'F');

        pdf.setTextColor(55, 65, 81); // gray-700

        const rowData = [
          String(student.no),
          student.name,
          student.email,
          student.instrument,
          STATUS_LABEL[student.status] || student.status,
          student.enrolledAt,
          `${student.completedSessions}/${student.totalSessions}`,
        ];

        let cx = margin;
        rowData.forEach((cell, i) => {
          const maxW = COLUMNS[i][1] - 3;
          const truncated = pdf.splitTextToSize(cell, maxW)[0] ?? '';
          pdf.text(truncated, cx + 1.5, y + 5.5);
          cx += COLUMNS[i][1];
        });

        // Garis bawah baris
        pdf.setDrawColor(229, 231, 235);
        pdf.setLineWidth(0.1);
        pdf.line(margin, y + rowH, pageW - margin, y + rowH);

        y += rowH;
      });

      // Garis luar tabel
      pdf.setDrawColor(209, 213, 219);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, 81, contentW, y - 81, 'S');

      // ── Footer ───────────────────────────────────────────────────
      y += 6;
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(156, 163, 175); // gray-400
      pdf.text('Music Sphere — Laporan dibuat otomatis oleh sistem', margin, y);
      pdf.text(today, pageW - margin, y, { align: 'right' });

      const fileName = `Laporan-Siswa-${selectedCourse.title.replace(/\s+/g, '-')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Siswa</h1>
          <p className="text-sm text-gray-500 mt-1">Cetak daftar siswa berdasarkan kursus</p>
        </div>
        {hasFetched && students.length > 0 && (
          <button
            onClick={handleDownloadPdf}
            disabled={isPdfLoading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {isPdfLoading ? 'Membuat PDF...' : 'Unduh PDF'}
          </button>
        )}
      </div>

      {/* Form Pilih Kursus */}
      <Card>
        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-indigo-500" />
            Pilih Kursus
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Pilih Kursus --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}{c.mentor ? ` — ${c.mentor.name}` : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!selectedCourseId || isLoading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isLoading ? 'Memuat...' : 'Tampilkan Laporan'}
            </button>
          </div>
        </div>
      </Card>

      {/* Preview Laporan di layar */}
      {hasFetched && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Kop */}
          <div className="bg-indigo-700 px-8 py-6 text-white">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/faviconmusicsphere.png" alt="Music Sphere" className="w-10 h-10 rounded-lg object-contain" />
              <div>
                <h2 className="text-xl font-bold">Music Sphere</h2>
                <p className="text-indigo-200 text-sm">Lembaga Kursus Musik</p>
              </div>
            </div>
            <div className="mt-4 border-t border-indigo-600 pt-4">
              <h3 className="text-lg font-semibold">Laporan Daftar Siswa</h3>
              <p className="text-indigo-200 text-sm mt-0.5">Per Kursus — Dicetak pada {today}</p>
            </div>
          </div>

          {/* Info Kursus */}
          <div className="px-8 py-5 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-medium">Nama Kursus</p>
                <p className="text-gray-900 font-semibold mt-0.5">{selectedCourse?.title}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Mentor</p>
                <p className="text-gray-900 font-semibold mt-0.5">{selectedCourse?.mentor?.name || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Total Siswa</p>
                <p className="text-gray-900 font-semibold mt-0.5">{students.length} siswa</p>
              </div>
            </div>
          </div>

          {/* Tabel */}
          {students.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {COLUMNS.map(([label]) => (
                    <th key={label} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 text-center">{student.no}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{student.name}</td>
                    <td className="px-4 py-3 text-gray-600">{student.email}</td>
                    <td className="px-4 py-3 text-gray-600">{student.instrument}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        student.status === 'active' ? 'bg-green-100 text-green-700'
                        : student.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-700'
                        : student.status === 'completed' ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                      }`}>
                        {STATUS_LABEL[student.status] || student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{student.enrolledAt}</td>
                    <td className="px-4 py-3 text-gray-600">{student.completedSessions}/{student.totalSessions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center gap-2 py-16 text-gray-400">
              <FileText size={40} className="text-gray-300" />
              <p className="font-medium">Belum ada siswa terdaftar</p>
              <p className="text-sm">Kursus ini belum memiliki siswa yang enrolled</p>
            </div>
          )}

          {students.length > 0 && (
            <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Music Sphere — Laporan dibuat otomatis oleh sistem</span>
                <span>{today}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Placeholder */}
      {!hasFetched && (
        <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
          <FileText size={52} className="text-gray-200" />
          <p className="font-medium text-gray-500">Pilih kursus dan klik &ldquo;Tampilkan Laporan&rdquo;</p>
          <p className="text-sm">Laporan akan menampilkan daftar siswa yang terdaftar di kursus tersebut</p>
        </div>
      )}
    </div>
  );
}

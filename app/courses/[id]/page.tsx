import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const course = await prisma.course.findUnique({
    where: { id },
    include: { mentor: { select: { name: true } } },
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-900 text-white">
      <LandingNavbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex mb-8 text-sm text-gray-400">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <Link href="/#courses" className="hover:text-white transition-colors">Courses</Link>
                <span className="mx-2">/</span>
                <span className="text-white">{course.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero Image */}
                    <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                        {course.image ? (
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <svg className="w-24 h-24 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                </svg>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{course.title}</h1>
                            <div className="flex items-center gap-4 text-gray-300 text-sm">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    45 Menit / Sesi
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {course.mentor?.name || 'Mentor'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">Tentang Kursus Ini</h2>
                        <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line leading-relaxed">
                            {course.description}
                        </div>
                    </div>

                    {/* Curriculum Highlights */}
                    <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-6">Materi Pembelajaran</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Pengenalan Instrumen & Dasar Teori",
                                "Teknik Dasar & Latihan Jari",
                                "Membaca Not Balok & Tablature",
                                "Latihan Lagu & Repertoar",
                                "Improvisasi & Kreativitas",
                                "Persiapan Pola Pikir Performer"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                                    <div className="w-6 h-6 rounded-full bg-red-900/30 text-red-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-300 text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="sticky top-24">
                        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
                            <div className="mb-6">
                                <p className="text-sm text-gray-400 mb-1">Biaya Kursus</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-white">Rp {course.monthlyFee.toLocaleString('id-ID')}</span>
                                    <span className="text-gray-400">/bulan</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm py-3 border-b border-gray-700">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Durasi
                                    </span>
                                    <span className="font-medium text-white">45 Menit</span>
                                </div>
                                <div className="flex justify-between text-sm py-3 border-b border-gray-700">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Level
                                    </span>
                                    <span className="font-medium text-white">All Levels</span>
                                </div>
                                <div className="flex justify-between text-sm py-3 border-b border-gray-700">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        Tempat
                                    </span>
                                    <span className="font-medium text-white">Studio MusicSphere</span>
                                </div>
                                <div className="flex justify-between text-sm py-3 border-b border-gray-700">
                                    <span className="text-gray-400 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Sertifikat
                                    </span>
                                    <span className="font-medium text-white">Ya</span>
                                </div>
                            </div>

                            <Link href="/auth/login" className="block w-full">
                                <button className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-600/20 transform hover:-translate-y-0.5">
                                    Daftar Sekarang
                                </button>
                            </Link>
                            
                            <p className="mt-4 text-xs text-center text-gray-500">
                                100% Aman & Terpercaya. Pembayaran via Transfer / QRIS.
                            </p>
                        </div>

                        <div className="mt-6 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                            <h3 className="font-bold text-white mb-2">Butuh Bantuan?</h3>
                            <p className="text-sm text-gray-400 mb-4">Hubungi tim kami untuk konsultasi lebih lanjut.</p>
                            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-green-600/10 text-green-500 rounded-lg hover:bg-green-600/20 transition-colors font-medium text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.151-.174.2-.298.3-.495.099-.198.05-.372-.025-.52-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.516l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                WhatsApp Kami
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
}

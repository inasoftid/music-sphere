'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop',
    title: 'Mulai Perjalanan Musikmu',
    subtitle: 'Belajar dari guru profesional dengan metode terbaik',
  },
  {
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop',
    title: 'Piano, Gitar, Vokal & Lainnya',
    subtitle: 'Pilihan kelas lengkap untuk semua level dan usia',
  },
  {
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384ebd?q=80&w=2068&auto=format&fit=crop',
    title: 'Jadwal Fleksibel',
    subtitle: 'Atur waktu belajar sesuai kenyamananmu',
  },
];

export function LandingHero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section id="home" className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-xs font-medium">Pendaftaran Dibuka</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              {slides[current].title}
            </h1>
            <p className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed">
              {slides[current].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
              >
                Daftar Sekarang
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#courses"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
              >
                Lihat Kursus
              </a>
            </div>


          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

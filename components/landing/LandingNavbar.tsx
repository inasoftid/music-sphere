'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { usePathname } from 'next/navigation';

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '/#home' },
    { label: 'Tentang', href: '/#about' },
    { label: 'Kursus', href: '/#courses' },
    { label: 'Kontak', href: '/#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled || !isHomePage
          ? 'bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-20 items-center">
          {/* Logo */}
          <Link href="/#home" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <span className={`text-xl font-bold transition-colors ${scrolled || !isHomePage ? 'text-white' : 'text-white'}`}>
              Music<span className="text-red-600">Sphere</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  scrolled || !isHomePage
                    ? 'text-gray-300 hover:text-white hover:bg-white/10'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/login"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                scrolled || !isHomePage
                  ? 'text-gray-300 hover:text-white'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Masuk
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Daftar
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled || !isHomePage ? 'text-gray-300 hover:bg-gray-800' : 'text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`border-t px-4 py-3 space-y-1 shadow-lg ${scrolled || !isHomePage ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${
                scrolled || !isHomePage
                  ? 'text-gray-300 hover:text-white hover:bg-white/10'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/auth/login"
              className={`block text-center px-4 py-2.5 border rounded-lg font-medium transition-colors ${
                scrolled || !isHomePage
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Masuk
            </Link>
            <Link
              href="/auth/register"
              className="block text-center px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

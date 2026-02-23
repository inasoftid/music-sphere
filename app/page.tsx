import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingAbout } from '@/components/landing/LandingAbout';
import { LandingCourses } from '@/components/landing/LandingCourses';
import { LandingContact } from '@/components/landing/LandingContact';
import Link from 'next/link';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingAbout />
        <LandingCourses />
        <LandingContact />
      </main>

      <LandingFooter />
    </div>
  );
}

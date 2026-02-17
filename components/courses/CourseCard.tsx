import React from 'react';
import Link from 'next/link';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/5 overflow-hidden hover:border-red-500/50 hover:shadow-red-900/20 transition-all duration-300 flex flex-col h-full group">
      <div className="relative h-56 w-full bg-gray-900 overflow-hidden">
        {/* Placeholder for image */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-700 bg-gray-900 group-hover:scale-105 transition-transform duration-500">
             {course.image ? (
                <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
             ) : (
                <span className="text-6xl opacity-20">🎵</span>
             )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col relative">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">{course.title}</h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1 leading-relaxed">{course.description}</p>
        
        <div className="mt-auto pt-4 border-t border-white/10 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.activeStudents} students
            </span>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">Bulanan</span>
              <span className="font-bold text-xl text-white">
                <span className="text-xs text-gray-500 font-normal mr-1">Rp</span>
                {course.monthlyFee.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
          
          <Link href={`/dashboard/courses/${course.id}`} className="block">
            <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-red-600 hover:border-red-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group-hover/btn">
              Lihat Detail
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { PracticeContent } from '@/types';


interface PracticeCardProps {
  content: PracticeContent;
  onClick?: (videoUrl: string) => void;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({ content, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(content.videoUrl);
    }
  };

  return (
    <a
      href={content.videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      onClick={handleClick}
    >
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-red-500/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-900/10">
        <div className="relative aspect-video bg-gray-900">
          {content.thumbnailUrl ? (
            <img
              src={content.thumbnailUrl}
              alt={content.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded font-medium">
            {content.duration}
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-xl shadow-red-900/50">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-4">
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
            {content.courseName}
          </span>
          <h3 className="mt-1.5 text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
            {content.title}
          </h3>
        </div>
      </div>
    </a>
  );
};

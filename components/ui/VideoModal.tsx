import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  const getEmbedUrl = (url: string) => {
    let videoId = '';
    
    // Handle standard youtube.com/watch?v=ID
    const matchStandard = url.match(/[?&]v=([^&]+)/);
    if (matchStandard) {
        videoId = matchStandard[1];
    } else {
        // Handle youtu.be/ID
        const matchShort = url.match(/youtu\.be\/([^?]+)/);
        if (matchShort) {
            videoId = matchShort[1];
        } else {
             // If already an embed URL or other format, return as is
             return url; 
        }
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animated fadeIn" onClick={onClose}>
      <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10 backdrop-blur-md"
        >
          <X size={24} />
        </button>
        <iframe
          src={embedUrl}
          title="YouTube video player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

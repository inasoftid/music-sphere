import React from 'react';

interface TimeSlotProps {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({
  startTime,
  endTime,
  isAvailable,
  isSelected,
  onSelect,
}) => {
  const baseStyles = "px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 flex flex-col items-center justify-center gap-0.5";
  const availableStyles = "bg-gray-800/50 border-white/10 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-red-500/50 cursor-pointer shadow-sm";
  const selectedStyles = "bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40 ring-2 ring-red-500/20 transform scale-[1.02]";
  const unavailableStyles = "bg-gray-900/30 border-white/5 text-gray-600 cursor-not-allowed opacity-50 line-through";

  let className = baseStyles;
  if (!isAvailable) {
    className += ` ${unavailableStyles}`;
  } else if (isSelected) {
    className += ` ${selectedStyles}`;
  } else {
    className += ` ${availableStyles}`;
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() => isAvailable && onSelect()}
      disabled={!isAvailable}
    >
      <span className="font-semibold">{startTime} - {endTime}</span>
      <span className={`text-xs ${isSelected ? 'text-red-200' : isAvailable ? 'text-gray-500' : 'text-gray-700'}`}>
        {isAvailable ? '45 menit' : 'Terisi'}
      </span>
    </button>
  );
};

import React from 'react';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: string;
  trendUp?: boolean;
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  icon,
  iconBg = 'bg-indigo-50 text-indigo-600',
  trend,
  trendUp,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              trendUp
                ? 'text-green-700 bg-green-50'
                : 'text-red-700 bg-red-50'
            }`}
          >
            <svg
              className={`w-3 h-3 ${trendUp ? '' : 'rotate-180'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>
    </div>
  );
};

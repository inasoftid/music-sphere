import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  labelClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  labelClassName,
  id,
  ...props
}) => {
  const inputId = id || props.name;
  const widthClass = fullWidth ? 'w-full' : '';
  
  const errorClass = error 
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-900/10 text-white placeholder-red-300' 
    : 'border-white/10 focus:ring-red-500/20 focus:border-red-500/50 bg-gray-900/50 text-white placeholder-gray-500 hover:border-white/20 transition-colors';

  return (
    <div className={`${widthClass} mb-4`}>
      {label && (
        <label htmlFor={inputId} className={`block text-sm font-medium mb-1.5 ${labelClassName || 'text-gray-300'}`}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`block w-full rounded-lg border shadow-sm py-2.5 px-4 sm:text-sm focus:outline-none focus:ring-2 ${errorClass} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id={`${inputId}-error`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

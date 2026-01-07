import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-700 mb-2">{label}</label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2.5 rounded-lg border border-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent',
          'bg-white text-gray-900 placeholder-gray-400',
          'transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

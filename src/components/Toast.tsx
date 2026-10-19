import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed top-18 inset-x-4 z-50 flex justify-center pointer-events-none transition-all duration-300">
      <div
        className={`px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 max-w-sm border text-sm font-medium ${
          isError
            ? 'bg-[#ffdad6] text-[#93000a] border-[#ba1a1a]/20'
            : isInfo
            ? 'bg-[#3e4642] text-white border-[#717973]/30'
            : 'bg-[#013623] text-white border-[#1e4d38]'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isError ? 'error' : isInfo ? 'info' : 'check_circle'}
        </span>
        <span className="text-xs">{toast.message}</span>
      </div>
    </div>
  );
};

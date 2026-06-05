import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white text-[#1e1b4b] px-5 py-4 rounded-2xl shadow-[0_15px_50px_rgba(79,70,40,0.065)] border border-[#f5f1ea] backdrop-blur-md animate-slide-in">
      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
        <CheckCircle className="text-emerald-500 w-4 h-4" />
      </div>
      <p className="text-xs font-bold pr-2 text-slate-700 leading-relaxed max-w-xs">{message}</p>
      <button 
        onClick={onClose} 
        className="text-slate-400 hover:text-[#f43f5e] transition-colors focus:outline-none ml-auto"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

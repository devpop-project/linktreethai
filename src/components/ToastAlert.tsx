'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface ToastAlertProps {
  toast: {
    type: 'success' | 'error' | 'info';
    message: string;
  } | null;
  onClose: () => void;
}

export const ToastAlert: React.FC<ToastAlertProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500'
              : toast.type === 'error'
              ? 'bg-red-600 text-white border-red-500'
              : 'bg-blue-600 text-white border-blue-500'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold leading-relaxed flex-1">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-200" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0 text-red-200" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-blue-200" />}
            <span className="whitespace-pre-line">{toast.message}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition text-white">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

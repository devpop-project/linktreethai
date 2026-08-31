'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Copy, Check } from 'lucide-react';

interface QrShareModalProps {
  isOpen: boolean;
  title: string;
  url: string;
  onClose: () => void;
}

export const QrShareModal: React.FC<QrShareModalProps> = ({ isOpen, title, url, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4 text-center"
        >
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900">
              <QrCode className="w-5 h-5 text-blue-600" />
              <span>แชร์ลิงก์ & QR Code</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-gray-900 line-clamp-1">{title}</h3>
            <p className="text-[11px] text-gray-500">สแกน QR Code ด้วยกล้องมือถือเพื่อเข้าถึงทันที</p>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center space-y-2">
            <img
              src={qrImageUrl}
              alt="QR Code"
              className="w-48 h-48 object-contain rounded-xl border border-gray-300 shadow-sm bg-white p-2"
            />
          </div>

          {/* URL Input & Copy Button */}
          <div className="space-y-2">
            <div className="flex items-center bg-gray-100 p-2 rounded-xl border border-gray-200 text-xs">
              <input
                type="text"
                readOnly
                value={url}
                className="bg-transparent text-gray-700 font-mono text-[11px] w-full outline-none truncate px-1"
              />
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

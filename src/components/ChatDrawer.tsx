'use client';

import React, { useState } from 'react';
import { ShieldCheck, X, Send } from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  sellerName: string;
  productName: string;
  onClose: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, sellerName, productName, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: sellerName, text: `สวัสดีครับ สนใจสินค้า "${productName}" สอบถามข้อมูลเพิ่มเติมได้เลยครับ!` }
  ]);
  const [chatInput, setChatInput] = useState('');

  if (!isOpen) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { sender: 'คุณ', text: chatInput }]);
    setChatInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-300 overflow-hidden flex flex-col">
      <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-bold text-xs truncate">แชตผู้ขาย: {sellerName}</span>
        </div>
        <button onClick={onClose} className="hover:text-gray-200">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 bg-gray-50 text-[11px] font-semibold text-emerald-800 border-b border-gray-200">
        สินค้าที่สนใจ: {productName}
      </div>

      <div className="p-3 h-52 overflow-y-auto space-y-2 text-xs bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.sender === 'คุณ' ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-gray-400">{msg.sender}</span>
            <div className={`p-2.5 rounded-xl max-w-[85%] ${
              msg.sender === 'คุณ' ? 'bg-blue-600 text-white font-medium' : 'bg-gray-200 text-gray-800'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendChat} className="p-2 border-t border-gray-200 flex gap-2 bg-white">
        <input
          type="text"
          placeholder="พิมพ์ข้อความแชต..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs outline-none focus:border-emerald-500"
        />
        <button type="submit" className="bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-700 transition">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

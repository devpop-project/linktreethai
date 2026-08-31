'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Save, ShoppingCart } from 'lucide-react';
import { Post } from '../lib/supabase/types';

interface EditPostModalProps {
  isOpen: boolean;
  post: Post | null;
  onClose: () => void;
  onSaveUpdate: (updatedData: { id: string; title: string; content: string; products: Array<{ id?: string; name: string; price: number }> }) => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, post, onClose, onSaveUpdate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [products, setProducts] = useState<Array<{ id?: string; name: string; price: number }>>([]);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      if (post.products && post.products.length > 0) {
        setProducts(post.products.map(p => ({ id: p.id, name: p.name, price: Number(p.price) })));
      } else {
        setProducts([]);
      }
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...products];
    (updated[index] as any)[field] = value;
    setProducts(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveUpdate({
      id: post.id,
      title,
      content,
      products
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
              <Edit3 className="w-5 h-5 text-blue-600" />
              <span>แก้ไขกระทู้ / รายการสินค้า</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 max-h-[75vh]">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">หัวข้อกระทู้ / ชื่อแผงค้า</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">รายละเอียดเนื้อหา</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs text-gray-800"
              />
            </div>

            {/* Products Edit Section */}
            {products.length > 0 && (
              <div className="border-t border-gray-200 pt-3 space-y-3">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4 text-emerald-600" /> รายการสินค้าในกระทู้นี้
                </span>

                {products.map((prod, idx) => (
                  <div key={idx} className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="ชื่อสินค้า..."
                      value={prod.name}
                      onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-800 bg-white"
                    />
                    <input
                      type="number"
                      placeholder="ราคา (บาท)..."
                      value={prod.price}
                      onChange={(e) => handleProductChange(idx, 'price', Number(e.target.value))}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-800 bg-white"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> บันทึกการแก้ไข
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

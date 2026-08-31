'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, MessageSquare, Plus, Trash2, Tag, Upload, AlertCircle, RefreshCw, ShoppingCart } from 'lucide-react';
import { PostType } from '../lib/supabase/types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (newPostData: any) => Promise<void> | void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB Limit per file
const MAX_PRODUCT_IMAGES = 4; // Max 4 photos per product

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmitPost }) => {
  const [postType, setPostType] = useState<PostType>('discussion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Local Media Files & Previews
  const [mediaItems, setMediaItems] = useState<Array<{ file: File; previewUrl: string; type: 'image' | 'video' }>>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  // Hidden File Inputs Refs
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);
  const [activeProductIndex, setActiveProductIndex] = useState<number>(0);

  // Marketplace Products (Multi-item, Max 4 images per item)
  const [products, setProducts] = useState<Array<{
    name: string;
    price: string;
    description: string;
    imageItems: Array<{ file: File; previewUrl: string }>;
  }>>([
    { name: '', price: '', description: '', imageItems: [] }
  ]);

  if (!isOpen) return null;

  // Handle Local File Selection for General Post Media
  const handleMediaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: Array<{ file: File; previewUrl: string; type: 'image' | 'video' }> = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        const errMsg = `ไฟล์ "${file.name}" มีขนาดใหญ่เกินไป (${sizeInMB} MB) กรุณาเลือกไฟล์ขนาดไม่เกิน 5MB`;
        setFileError(errMsg);
        alert(errMsg);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      newItems.push({ file, previewUrl, type: isVideo ? 'video' : 'image' });
    });

    if (newItems.length > 0) {
      setMediaItems((prev) => [...prev, ...newItems]);
    }

    if (e.target) e.target.value = '';
  };

  // Handle Local File Selection for Marketplace Product Images (Max 4 photos)
  const handleProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>, pIndex: number) => {
    setFileError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentCount = products[pIndex].imageItems.length;
    if (currentCount >= MAX_PRODUCT_IMAGES) {
      alert(`⚠️ สามารถแนบรูปภาพสินค้าได้สูงสุด ${MAX_PRODUCT_IMAGES} รูปต่อ 1 รายการสินค้าเท่านั้น`);
      if (e.target) e.target.value = '';
      return;
    }

    const newProdItems: Array<{ file: File; previewUrl: string }> = [];

    Array.from(files).forEach((file) => {
      if (currentCount + newProdItems.length >= MAX_PRODUCT_IMAGES) {
        alert(`⚠️ เกินโควตา 4 รูปภาพ: รูปภาพเพิ่มเติมจะถูกข้ามไป`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        const errMsg = `รูปภาพสินค้า "${file.name}" มีขนาดเกิน 5MB (${sizeInMB} MB) กรุณาเลือกรูปขนาดไม่เกิน 5MB`;
        setFileError(errMsg);
        alert(errMsg);
        return;
      }

      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        newProdItems.push({ file, previewUrl });
      }
    });

    if (newProdItems.length > 0) {
      const updated = [...products];
      updated[pIndex].imageItems = [...updated[pIndex].imageItems, ...newProdItems];
      setProducts(updated);
    }

    if (e.target) e.target.value = '';
  };

  const handleAddProduct = () => {
    setProducts([...products, { name: '', price: '', description: '', imageItems: [] }]);
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...products];
    (updated[index] as any)[field] = value;
    setProducts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('⚠️ กรุณากรอกหัวข้อกระทู้ หรือ ชื่อแผงค้าก่อนกดโพสต์');
      return;
    }

    setIsSubmitting(true);
    try {
      const postPayload = {
        title,
        content,
        post_type: postType,
        mediaItems,
        products: postType === 'marketplace' ? products : []
      };

      await onSubmitPost(postPayload);
      
      // Reset form
      setTitle('');
      setContent('');
      setMediaItems([]);
      onClose();
    } catch (err: any) {
      alert('❌ เกิดข้อผิดพลาดในการลงกระทู้: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-800">ตั้งกระทู้ใหม่ / ลงขายสินค้า</h2>
            <button onClick={onClose} disabled={isSubmitting} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={mediaFileInputRef}
            accept="image/*,video/*"
            multiple
            onChange={handleMediaFileUpload}
            className="hidden"
          />
          <input
            type="file"
            ref={productFileInputRef}
            accept="image/*"
            multiple
            onChange={(e) => handleProductFileUpload(e, activeProductIndex)}
            className="hidden"
          />

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            {fileError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Select Post Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">เลือกประเภทกระทู้</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: 'discussion', label: 'สนทนา', icon: MessageSquare, color: 'text-blue-500' },
                  { id: 'question', label: 'คำถาม', icon: HelpCircle, color: 'text-amber-500' },
                  { id: 'marketplace', label: 'ขายของ', icon: ShoppingCart, color: 'text-emerald-500' },
                  { id: 'review', label: 'รีวิว', icon: Tag, color: 'text-purple-500' },
                  { id: 'news', label: 'ข่าว', icon: Tag, color: 'text-red-500' },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = postType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPostType(type.id as PostType)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${type.color}`} />
                      <span className="text-xs">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">หัวข้อกระทู้ / ชื่อแผงค้า <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="ระบุหัวข้อที่ต้องการพูดคุย หรือ ชื่อร้าน/กลุ่มสินค้า..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs text-gray-800"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">รายละเอียดเนื้อหา</label>
              <textarea
                rows={3}
                placeholder="เขียนรายละเอียด อธิบายเพิ่มเติม..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs text-gray-800"
              />
            </div>

            {/* File Upload Box */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-800 block">อัปโหลดไฟล์รูปภาพ / วิดีโอจากเครื่อง</span>
                  <span className="text-[11px] text-gray-500">ขนาดไฟล์ไม่เกิน 5MB ต่อไฟล์</span>
                </div>
                <button
                  type="button"
                  onClick={() => mediaFileInputRef.current?.click()}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition"
                >
                  <Upload className="w-3.5 h-3.5" /> เลือกไฟล์จากเครื่อง
                </button>
              </div>

              {/* Preview Attached Media Items */}
              {mediaItems.length > 0 && (
                <div className="space-y-1 pt-2">
                  <span className="text-[11px] font-bold text-gray-600">ไฟล์แนบที่เลือก ({mediaItems.length} ไฟล์):</span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {mediaItems.map((item, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-300 shrink-0 shadow-xs bg-black">
                        {item.type === 'video' ? (
                          <video src={item.previewUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.previewUrl} alt="preview" className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => setMediaItems(mediaItems.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 hover:bg-black transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Marketplace Specific: Multi-item Products (Max 4 Photos per product) */}
            {postType === 'marketplace' && (
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 text-xs flex items-center gap-2 uppercase tracking-wider">
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                    รายการสินค้าที่ต้องการลงขาย (1 กระทู้ ลงได้หลายสินค้า)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-100 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> เพิ่มรายการสินค้า
                  </button>
                </div>

                {products.map((prod, pIdx) => (
                  <div key={pIdx} className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800">รายการสินค้า #{pIdx + 1}</span>
                      {products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(pIdx)}
                          className="text-red-500 hover:text-red-700 p-1 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="ชื่อสินค้า..."
                        value={prod.name}
                        onChange={(e) => handleProductChange(pIdx, 'name', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-800 bg-white focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="ราคา (บาท)..."
                        value={prod.price}
                        onChange={(e) => handleProductChange(pIdx, 'price', e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-800 bg-white focus:outline-none"
                      />
                    </div>

                    {/* Product Images (Max 4 Photos per Item) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-gray-700">
                          รูปภาพสินค้า (อัปโหลดสูงสุด 4 รูป — ปัจจุบัน {prod.imageItems.length}/4)
                        </span>
                        {prod.imageItems.length < MAX_PRODUCT_IMAGES ? (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveProductIndex(pIdx);
                              productFileInputRef.current?.click();
                            }}
                            className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold hover:underline"
                          >
                            <Upload className="w-3 h-3" /> เลือกรูปสินค้าจากเครื่อง
                          </button>
                        ) : (
                          <span className="text-[11px] text-amber-700 font-bold">ครบ 4 รูปแล้ว</span>
                        )}
                      </div>

                      {prod.imageItems.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pt-1">
                          {prod.imageItems.map((item, iIdx) => (
                            <div key={iIdx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-300 shrink-0">
                              <img src={item.previewUrl} alt="product" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...products];
                                  updated[pIdx].imageItems = updated[pIdx].imageItems.filter((_, i) => i !== iIdx);
                                  setProducts(updated);
                                }}
                                className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5 hover:bg-black"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2 disabled:bg-blue-400"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>กำลังบันทึกโพสต์และอัปโหลดไฟล์...</span>
                  </>
                ) : (
                  <span>โพสต์กระทู้ / ลงขายสินค้าทันที</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

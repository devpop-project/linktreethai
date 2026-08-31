'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Camera, Plus, Trash2, Save, Upload, Link as LinkIcon, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { Profile, SocialLink } from '../lib/supabase/types';
import { uploadFileToSupabase } from '../lib/supabase/storage';

interface EditProfileModalProps {
  isOpen: boolean;
  profile: Profile;
  onClose: () => void;
  onSaveProfile: (updatedProfile: Partial<Profile>) => Promise<void> | void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, profile, onClose, onSaveProfile }) => {
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [username, setUsername] = useState(profile.username || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [coverUrl, setCoverUrl] = useState(profile.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200');
  
  // Local File Objects for upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Linktree Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(profile.social_links || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Hidden File Input Refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(profile.full_name || '');
    setUsername(profile.username || '');
    setBio(profile.bio || '');
    setAvatarUrl(profile.avatar_url || '');
    setCoverUrl(profile.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200');
    setSocialLinks(profile.social_links || []);
  }, [profile]);

  if (!isOpen) return null;

  // Avatar Upload Handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      const errMsg = `รูปโปรไฟล์ "${file.name}" มีขนาดเกิน 5MB กรุณาเลือกไฟล์ขนาดไม่เกิน 5MB`;
      setFileError(errMsg);
      alert(errMsg);
      return;
    }

    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(file));
  };

  // Cover Upload Handler
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      const errMsg = `รูปภาพหน้าปก "${file.name}" มีขนาดเกิน 5MB กรุณาเลือกไฟล์ขนาดไม่เกิน 5MB`;
      setFileError(errMsg);
      alert(errMsg);
      return;
    }

    setCoverFile(file);
    setCoverUrl(URL.createObjectURL(file));
  };

  // Add New Social Link
  const handleAddSocialLink = () => {
    const newLink: SocialLink = {
      id: `link_${Date.now()}`,
      platform: 'facebook',
      title: 'ติดตามเราทาง Facebook',
      url: 'https://facebook.com/'
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  // Remove Social Link
  const handleRemoveSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter(l => l.id !== id));
  };

  // Update Social Link Field
  const handleUpdateSocialLink = (id: string, field: keyof SocialLink, value: any) => {
    setSocialLinks(socialLinks.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) {
      alert('⚠️ กรุณากรอกชื่อ และ Username ให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalAvatarUrl = avatarUrl;
      let finalCoverUrl = coverUrl;

      // 1. Upload Avatar File if changed
      if (avatarFile) {
        const { url: uploadedAvatar } = await uploadFileToSupabase(avatarFile, 'posts');
        if (uploadedAvatar) finalAvatarUrl = uploadedAvatar;
      }

      // 2. Upload Cover File if changed
      if (coverFile) {
        const { url: uploadedCover } = await uploadFileToSupabase(coverFile, 'posts');
        if (uploadedCover) finalCoverUrl = uploadedCover;
      }

      // 3. Save Updated Profile
      await onSaveProfile({
        full_name: fullName,
        username: username.replace(/^@/, ''),
        bio,
        avatar_url: finalAvatarUrl,
        cover_url: finalCoverUrl,
        social_links: socialLinks
      });

      onClose();
    } catch (err: any) {
      alert('❌ เกิดข้อผิดพลาดในการบันทึกโปรไฟล์: ' + (err.message || err));
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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>แก้ไขข้อมูลส่วนตัว & ลิงก์ร้านค้า</span>
            </h2>
            <button onClick={onClose} disabled={isSubmitting} className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hidden File Inputs */}
          <input type="file" ref={avatarInputRef} accept="image/*" onChange={handleAvatarChange} className="hidden" />
          <input type="file" ref={coverInputRef} accept="image/*" onChange={handleCoverChange} className="hidden" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            {fileError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Cover Banner & Avatar Upload Section */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 group">
              {/* Cover Banner Preview */}
              <div className="h-32 w-full relative bg-gray-900">
                <img src={coverUrl} alt="cover" className="w-full h-full object-cover opacity-90" />
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-sm flex items-center gap-1.5 transition shadow"
                >
                  <Camera className="w-3.5 h-3.5" /> เปลี่ยนภาพหน้าปก
                </button>
              </div>

              {/* Avatar Image Preview */}
              <div className="p-4 relative bg-white flex items-end justify-between -mt-10">
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    style={{ width: '80px', height: '80px' }}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md shrink-0 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow transition"
                    title="เปลี่ยนรูปโปรไฟล์"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[11px] text-gray-500 font-medium">แนะนำรูปไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</span>
              </div>
            </div>

            {/* Text Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ชื่อ-นามสกุล / ชื่อร้านค้า <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ชื่อผู้ใช้งาน (Username Handle) <span className="text-red-500">*</span></label>
                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs focus-within:border-blue-500 focus-within:bg-white">
                  <span className="text-gray-400 font-bold mr-1">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/^@/, ''))}
                    className="bg-transparent outline-none w-full text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Bio / Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">รายละเอียดร้านค้า / สโลแกน (Bio)</label>
              <textarea
                rows={3}
                placeholder="ระบุรายละเอียดร้านค้า ประวัติย่อ หรือสโลแกน..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Linktree-Style Social Media Links Manager */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <LinkIcon className="w-4 h-4 text-emerald-600" /> ลิงก์ร้านค้า & Social Media (Linktree Style)
                  </h3>
                  <p className="text-[11px] text-gray-500">เพิ่มลิงก์ Facebook, IG, TikTok, Line, Shopee ให้ลูกค้าคลิกเข้าดูง่ายๆ</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSocialLink}
                  className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-100 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> เพิ่มลิงก์
                </button>
              </div>

              {socialLinks.map((link, lIdx) => (
                <div key={link.id || lIdx} className="bg-gray-50 p-3 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={link.platform}
                      onChange={(e) => handleUpdateSocialLink(link.id, 'platform', e.target.value)}
                      className="bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 outline-none"
                    >
                      <option value="facebook">📘 Facebook</option>
                      <option value="instagram">📸 Instagram</option>
                      <option value="tiktok">🎵 TikTok</option>
                      <option value="line">💬 Line Official</option>
                      <option value="shopee">🛒 Shopee Store</option>
                      <option value="lazada">📦 Lazada Store</option>
                      <option value="youtube">▶️ YouTube</option>
                      <option value="website">🌐 เว็บไซต์ส่วนตัว</option>
                      <option value="custom">🔗 ลิงก์อื่นๆ</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(link.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="ชื่อปุ่มลิงก์..."
                      value={link.title}
                      onChange={(e) => handleUpdateSocialLink(link.id, 'title', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-800 bg-white"
                    />
                    <input
                      type="url"
                      placeholder="URL ลิงก์ (https://...)..."
                      value={link.url}
                      onChange={(e) => handleUpdateSocialLink(link.id, 'url', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-800 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

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
                    <span>กำลังอัปโหลดรูปและบันทึกโปรไฟล์...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>บันทึกการแก้ไขโปรไฟล์</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

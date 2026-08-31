'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, MessageSquare, Share2, Crown, Sparkles, CheckCircle2, ShoppingBag, Eye, Send, RefreshCw, X, ChevronLeft, ChevronRight, Images, QrCode } from 'lucide-react';
import { createClient } from '../lib/supabase/client';
import { QrShareModal } from './QrShareModal';
import { Post, Profile } from '../lib/supabase/types';

interface PostCardProps {
  post: Post;
  currentUser?: Profile | null;
  onOpenChatWithSeller?: (sellerName: string, productName: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onOpenChatWithSeller }) => {
  const supabase = createClient();
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Lightbox Modal State
  const [activeLightboxPhotos, setActiveLightboxPhotos] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // QR Share Modal State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Real Comments from Supabase DB
  const [commentsList, setCommentsList] = useState<Array<{ id: string; content: string; created_at: string; profile?: Profile }>>([]);

  const postMediaImages = post.media?.filter(m => m.media_type === 'image').map(m => m.media_url) || [];
  const videoMedia = post.media?.find(m => m.media_type === 'video');

  const openLightbox = (photos: string[], index: number) => {
    setActiveLightboxPhotos(photos);
    setLightboxIndex(index);
  };

  const fetchRealComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          profile:profiles(*)
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (data && !error) {
        setCommentsList(data as any);
      } else {
        setCommentsList([]);
      }
    } catch (err) {
      console.error('Fetch comments error:', err);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchRealComments();
    }
  }, [showComments]);

  const handleLike = async () => {
    const newLikes = hasLiked ? Math.max(0, likes - 1) : likes + 1;
    setLikes(newLikes);
    setHasLiked(!hasLiked);

    try {
      await supabase
        .from('posts')
        .update({ likes_count: newLikes })
        .eq('id', post.id);
    } catch (err) {
      console.error('Update likes error:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    if (!currentUser) {
      alert('⚠️ กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น');
      return;
    }

    setIsSubmittingComment(true);
    try {
      await supabase.from('profiles').upsert([{
        id: currentUser.id,
        username: currentUser.username,
        full_name: currentUser.full_name,
        avatar_url: currentUser.avatar_url,
        points_balance: currentUser.points_balance,
        user_tier: currentUser.user_tier,
        is_verified_seller: currentUser.is_verified_seller
      }]);

      const { error } = await supabase
        .from('comments')
        .insert([{
          post_id: post.id,
          user_id: currentUser.id,
          content: commentInput.trim()
        }]);

      if (error) {
        alert(`❌ ไม่สามารถส่งความคิดเห็นได้: ${error.message}`);
      } else {
        setCommentInput('');
        await fetchRealComments();
      }
    } catch (err: any) {
      alert(`❌ เกิดข้อผิดพลาดในการแสดงความคิดเห็น: ${err.message || err}`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const profile = post.profile || {
    id: '00000000-0000-0000-0000-000000000001',
    full_name: 'สมาชิก PantipSpace',
    username: 'user',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    user_tier: 'free',
    is_verified_seller: false
  };

  // Friendly Handle URL Format /@username
  const authorHandle = profile.username ? `@${profile.username}` : `@${profile.id}`;
  const currentPostUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${authorHandle}`
    : `https://pantipspace.com/${authorHandle}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4 transition hover:shadow-md">
      {/* 1. Header: Author info (Clickable Link to Friendly Handle /@username) & Tier Badges */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href={`/${authorHandle}`}>
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              style={{ width: '40px', height: '40px' }}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0 hover:opacity-90 transition cursor-pointer"
            />
          </Link>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs">
              <Link href={`/${authorHandle}`} className="hover:text-blue-600 transition">
                {profile.full_name}
              </Link>
              {profile.is_verified_seller && (
                <span className="text-blue-500" title="ผู้ขายยืนยันตัวตนแล้ว">
                  <CheckCircle2 className="w-4 h-4 fill-blue-500 text-white inline" />
                </span>
              )}
              {profile.user_tier === 'vip' && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Crown className="w-3 h-3 text-amber-600" /> VIP
                </span>
              )}
              {profile.user_tier === 'master' && (
                <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 text-purple-600" /> MASTER
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
              <span>{new Date(post.created_at).toLocaleDateString('th-TH')}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {post.views_count || 1} อ่าน</span>
            </div>
          </div>
        </div>

        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
          post.post_type === 'marketplace' ? 'bg-emerald-100 text-emerald-800' :
          post.post_type === 'question' ? 'bg-amber-100 text-amber-800' :
          post.post_type === 'review' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {post.post_type === 'marketplace' ? '🛒 กระทู้ขายของ' :
           post.post_type === 'question' ? '❓ กระทู้คำถาม' :
           post.post_type === 'review' ? '⭐ กระทู้รีวิว' : '💬 กระทู้สนทนา'}
        </span>
      </div>

      {/* 2. Body Content */}
      <div className="p-4 space-y-3">
        <h2 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug cursor-pointer hover:text-blue-600 transition">
          {post.title}
        </h2>
        {post.content && (
          <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {post.content}
          </p>
        )}

        {/* Media: Video Player */}
        {videoMedia && (
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center my-3">
            <video
              src={videoMedia.media_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Media: ONLY show Post Media Album if post itself has attached images */}
        {postMediaImages.length > 0 && (
          <div className="my-3">
            {postMediaImages.length === 1 && (
              <div
                onClick={() => openLightbox(postMediaImages, 0)}
                className="w-full max-h-[500px] min-h-[250px] bg-gray-50/80 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center cursor-pointer hover:opacity-95 transition p-1"
              >
                <img
                  src={postMediaImages[0]}
                  alt="post image"
                  className="max-h-[490px] w-full object-contain rounded-xl"
                />
              </div>
            )}

            {postMediaImages.length === 2 && (
              <div className="grid grid-cols-2 gap-1.5 max-h-96 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50/50 p-1">
                {postMediaImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(postMediaImages, idx)}
                    className="h-full max-h-96 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition"
                  >
                    <img src={imgUrl} alt="post image" className="h-full w-full object-contain" />
                  </div>
                ))}
              </div>
            )}

            {postMediaImages.length === 3 && (
              <div className="grid grid-cols-3 gap-1.5 max-h-80 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50/50 p-1">
                {postMediaImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(postMediaImages, idx)}
                    className="h-full max-h-80 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition"
                  >
                    <img src={imgUrl} alt="post image" className="h-full w-full object-contain" />
                  </div>
                ))}
              </div>
            )}

            {postMediaImages.length >= 4 && (
              <div className="grid grid-cols-2 gap-1.5 max-h-96 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50/50 p-1">
                {postMediaImages.slice(0, 4).map((imgUrl, idx) => {
                  const isFourth = idx === 3 && postMediaImages.length > 4;
                  const remainingCount = postMediaImages.length - 4;
                  return (
                    <div
                      key={idx}
                      onClick={() => openLightbox(postMediaImages, idx)}
                      className="relative h-44 sm:h-48 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition"
                    >
                      <img src={imgUrl} alt="post image" className="h-full w-full object-contain" />
                      {isFourth && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white font-black text-xl rounded-xl">
                          +{remainingCount} รูปภาพ
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. Marketplace Multi-Item Products Catalog */}
        {post.post_type === 'marketplace' && post.products && post.products.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <ShoppingBag className="w-4 h-4 text-emerald-600" /> สินค้าในกระทู้นี้ ({post.products.length} รายการ)
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {post.products.map((prod) => {
                const prodPhotoList = prod.images?.map(i => i.image_url) || [];
                return (
                  <div key={prod.id} className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-gray-900">{prod.name}</h4>
                        <div className="text-emerald-700 font-black text-base mt-0.5">
                          ฿{Number(prod.price).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-white border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          {prod.condition === 'new' ? 'มือหนึ่ง' : 'มือสอง'}
                        </span>
                        <button
                          onClick={() => onOpenChatWithSeller && onOpenChatWithSeller(profile.full_name, prod.name)}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-xl shadow-sm transition"
                        >
                          ทักแชตซื้อ
                        </button>
                      </div>
                    </div>

                    {/* Product Photos Gallery */}
                    {prodPhotoList.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600">
                          <Images className="w-3.5 h-3.5 text-emerald-600" />
                          <span>รูปภาพสินค้า ({prodPhotoList.length} รูป - คลิกดูรูปขยายใหญ่ได้):</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          {prodPhotoList.map((imgUrl, pImgIdx) => (
                            <div
                              key={pImgIdx}
                              onClick={() => openLightbox(prodPhotoList, pImgIdx)}
                              className="h-24 sm:h-28 rounded-xl border border-gray-200 overflow-hidden bg-white p-1 flex items-center justify-center cursor-pointer hover:border-emerald-500 hover:shadow-md transition group"
                            >
                              <img
                                src={imgUrl}
                                alt={`${prod.name} - ${pImgIdx + 1}`}
                                className="h-full w-full object-contain rounded-lg group-hover:scale-105 transition"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Footer Actions */}
      <div className="px-4 py-2 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 font-semibold">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-gray-100 transition ${
            hasLiked ? 'text-blue-600 font-bold' : ''
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-blue-600' : ''}`} />
          <span>{likes} ถูกใจ</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-gray-100 transition"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{commentsList.length} ความคิดเห็น</span>
        </button>

        <button
          onClick={() => setIsQrModalOpen(true)}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-gray-100 text-blue-600 font-bold transition"
        >
          <QrCode className="w-4 h-4" />
          <span>แชร์ / QR Code</span>
        </button>
      </div>

      {/* 5. Real Nested Comments Section */}
      {showComments && (
        <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between font-bold text-xs text-gray-800">
            <span>ความคิดเห็นทั้งหมดจากผู้ใช้จริง ({commentsList.length})</span>
            <button onClick={fetchRealComments} className="p-1 hover:bg-gray-200 rounded text-gray-500">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {commentsList.length === 0 ? (
              <p className="text-xs text-gray-400 italic text-center py-2">ยังไม่มีความคิดเห็นในกระทู้นี้ พิมพ์ความคิดเห็นของคุณเป็นคนแรกได้เลย!</p>
            ) : (
              commentsList.map((c) => {
                const commenterName = c.profile?.full_name || c.profile?.username || 'สมาชิก PantipSpace';
                const commenterAvatar = c.profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                return (
                  <div key={c.id} className="bg-white p-3 rounded-xl border border-gray-200 text-xs space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <div className="flex items-center gap-2">
                        <img src={commenterAvatar} alt="avatar" style={{ width: '24px', height: '24px' }} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <span>{commenterName}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-normal">
                        {new Date(c.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-700 pl-8 leading-relaxed">{c.content}</p>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder={currentUser ? `ตอบความคิดเห็นในชื่อ "${currentUser.full_name}"...` : 'กรุณาเข้าสู่ระบบเพื่อคอมเมนต์...'}
              value={commentInput}
              disabled={!currentUser || isSubmittingComment}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-blue-500 bg-white"
            />
            <button
              type="submit"
              disabled={!currentUser || isSubmittingComment || !commentInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 transition shrink-0"
            >
              {isSubmittingComment ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>ส่ง</span>
            </button>
          </form>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && activeLightboxPhotos[lightboxIndex] && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition z-50 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-4 bg-white/20 hover:bg-white/40 text-white p-2.5 rounded-full transition z-50 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center p-2"
            >
              <img
                src={activeLightboxPhotos[lightboxIndex]}
                alt="full preview"
                className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
              />
              <div className="mt-3 text-xs font-bold text-gray-300 bg-black/60 px-3 py-1 rounded-full border border-white/20">
                รูปภาพที่ {lightboxIndex + 1} จาก {activeLightboxPhotos.length}
              </div>
            </motion.div>

            {lightboxIndex < activeLightboxPhotos.length - 1 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-4 bg-white/20 hover:bg-white/40 text-white p-2.5 rounded-full transition z-50 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* QR Share Modal */}
      <QrShareModal
        isOpen={isQrModalOpen}
        title={post.title}
        url={currentPostUrl}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
};

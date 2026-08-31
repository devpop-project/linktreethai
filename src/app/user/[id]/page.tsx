'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { PostCard } from '../../../components/PostCard';
import { QrShareModal } from '../../../components/QrShareModal';
import { createClient } from '../../../lib/supabase/client';
import { Profile, Post } from '../../../lib/supabase/types';
import { Crown, Sparkles, CheckCircle2, ShieldCheck, Flame, QrCode, Share2, RefreshCw } from 'lucide-react';

const defaultDemoProfile: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  username: 'pantip_lover',
  full_name: 'คุณกิตติศักดิ์ (Seller Pro)',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  points_balance: 500,
  user_tier: 'vip',
  is_verified_seller: true,
};

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params?.id as string;
  const supabase = createClient();

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // QR Modal State
  const [qrModalState, setQrModalState] = useState<{ isOpen: boolean; title: string; url: string }>({
    isOpen: false,
    title: '',
    url: ''
  });

  const fetchPublicProfile = async () => {
    setLoading(true);
    try {
      // 1. Current Session User
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (myProfile) setCurrentUser(myProfile as Profile);
      }

      // 2. Fetch Targeted Public Profile
      const { data: targetProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (targetProfile) {
        setProfile(targetProfile as Profile);
      } else {
        setProfile(defaultDemoProfile);
      }

      // 3. Fetch Posts created by this user
      const { data: postsData } = await supabase
        .from('posts')
        .select(`*, profile:profiles(*), products(*, images:product_images(*)), media:post_media(*)`)
        .order('created_at', { ascending: false });

      if (postsData && postsData.length > 0) {
        setUserPosts(postsData.filter((p: any) => p.user_id === userId || p.profile?.id === userId) as Post[]);
      } else {
        setUserPosts([]);
      }
    } catch (err) {
      console.error('Error loading public profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicProfile();
  }, [userId]);

  const activeProfile = profile || defaultDemoProfile;
  const currentPublicUrl = typeof window !== 'undefined' ? window.location.href : `https://pantipspace.com/user/${userId}`;

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-gray-900 pb-12">
      <Navbar user={currentUser} />

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Profile Banner Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          <div className="p-6 relative pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
              <div className="flex items-end gap-4">
                <img
                  src={activeProfile.avatar_url}
                  alt={activeProfile.full_name}
                  style={{ width: '96px', height: '96px' }}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md shrink-0 bg-white"
                />
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold text-gray-900">{activeProfile.full_name}</h1>
                    {activeProfile.is_verified_seller && (
                      <span className="text-blue-500" title="ผู้ขายยืนยันตัวตนแล้ว">
                        <CheckCircle2 className="w-5 h-5 fill-blue-500 text-white" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-medium">@{activeProfile.username}</p>
                </div>
              </div>

              {/* Status Pills & Share QR Button */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <Crown className="w-4 h-4 text-amber-600" /> {activeProfile.user_tier.toUpperCase()} Member
                </span>
                <button
                  onClick={() => setQrModalState({
                    isOpen: true,
                    title: `โปรไฟล์ของ ${activeProfile.full_name}`,
                    url: currentPublicUrl
                  })}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <QrCode className="w-4 h-4" />
                  <span>แชร์ / QR Code โปรไฟล์</span>
                </button>
              </div>
            </div>

            {/* Seller Verification Status */}
            {activeProfile.is_verified_seller && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>สถานะผู้ขาย: ได้รับการตรวจสอบและยืนยันตัวตนเรียบร้อยแล้ว (Seller Verified)</span>
                </div>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">ยืนยันแล้ว</span>
              </div>
            )}
          </div>
        </div>

        {/* User's Public Posts */}
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-blue-600" /> กระทู้และรายการสินค้าของ {activeProfile.full_name} ({userPosts.length})
          </h2>

          {loading ? (
            <div className="bg-white p-8 rounded-2xl text-center text-xs text-gray-500 border border-gray-200 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <p className="font-bold">กำลังโหลดรายการกระทู้โปรไฟล์...</p>
            </div>
          ) : userPosts.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center text-xs text-gray-500 border border-gray-200">
              ผู้ใช้ท่านนี้ยังไม่ได้ลงกระทู้หรือสินค้าในระบบ
            </div>
          ) : (
            userPosts.map((post) => (
              <PostCard key={post.id} post={post} currentUser={currentUser} />
            ))
          )}
        </div>
      </main>

      {/* QR Share Modal */}
      <QrShareModal
        isOpen={qrModalState.isOpen}
        title={qrModalState.title}
        url={qrModalState.url}
        onClose={() => setQrModalState({ ...qrModalState, isOpen: false })}
      />
    </div>
  );
}

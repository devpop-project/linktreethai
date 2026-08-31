'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { createClient } from '../../lib/supabase/client';
import { uploadFileToSupabase } from '../../lib/supabase/storage';
import { Profile, Post } from '../../lib/supabase/types';
import { PostCard } from '../../components/PostCard';
import { CreatePostModal } from '../../components/CreatePostModal';
import { EditPostModal } from '../../components/EditPostModal';
import { EditProfileModal } from '../../components/EditProfileModal';
import { SocialLinksDisplay } from '../../components/SocialLinksDisplay';
import { ToastAlert } from '../../components/ToastAlert';
import { Crown, CheckCircle2, Coins, ShieldCheck, Flame, Plus, Trash2, Edit3, RefreshCw, UserEdit } from 'lucide-react';

const defaultProfile: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  username: 'pantip_lover',
  full_name: 'คุณกิตติศักดิ์ (Seller Pro)',
  bio: 'ยินดีต้อนรับสู่ร้านค้าทางการ ตรวจสอบสินค้าและสั่งซื้อแชตตรงได้ตลอดเวลาครับ!',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
  social_links: [
    { id: '1', platform: 'facebook', title: 'Facebook Page', url: 'https://facebook.com/' },
    { id: '2', platform: 'line', title: 'Line Official', url: 'https://line.me/' },
  ],
  points_balance: 500,
  user_tier: 'vip',
  is_verified_seller: true,
};

export default function ProfilePage() {
  const supabase = createClient();
  const [user, setUser] = useState<Profile>(defaultProfile);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Global Toast Alert State
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);

  const fetchProfileAndPosts = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session && session.user) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profileData) setUser(profileData as Profile);
      } else {
        setUser(defaultProfile);
      }

      const { data: postsData, error: postsErr } = await supabase
        .from('posts')
        .select(`*, profile:profiles(*), products(*, images:product_images(*)), media:post_media(*)`)
        .order('created_at', { ascending: false });

      if (postsErr) {
        console.error('Error fetching posts:', postsErr.message);
      }

      if (postsData && postsData.length > 0) {
        setMyPosts(postsData as Post[]);
      } else {
        setMyPosts([]);
      }
    } catch (err: any) {
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndPosts();
  }, []);

  // Save Profile Changes to Supabase DB
  const handleSaveProfile = async (updatedProfile: Partial<Profile>) => {
    setToast({ type: 'info', message: '⏳ กำลังบันทึกการแก้ไขโปรไฟล์ลง Supabase...' });

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert([{
          id: user.id,
          ...user,
          ...updatedProfile,
          updated_at: new Date().toISOString()
        }]);

      if (error) {
        alert(`❌ แก้ไขโปรไฟล์ไม่สำเร็จ: ${error.message}`);
        setToast({ type: 'error', message: `❌ แก้ไขโปรไฟล์ไม่สำเร็จ: ${error.message}` });
      } else {
        setUser((prev) => ({ ...prev, ...updatedProfile }));
        alert('✅ แก้ไขโปรไฟล์และลิงก์ร้านค้าเรียบร้อยแล้ว!');
        setToast({ type: 'success', message: '✅ บันทึกโปรไฟล์สำเร็จแล้ว!' });
        await fetchProfileAndPosts();
      }
    } catch (err: any) {
      alert(`❌ เกิดข้อผิดพลาด: ${err.message || err}`);
    }
  };

  // Handle Create Post
  const handleCreatePostFromProfile = async (postPayload: any) => {
    const activeUser = user || defaultProfile;
    alert('⏳ กำลังบันทึกโพสต์ใหม่และอัปโหลดข้อมูลจากหน้าโปรไฟล์...');
    setToast({ type: 'info', message: '⏳ กำลังบันทึกโพสต์ใหม่...' });

    try {
      await supabase.from('profiles').upsert([{
        id: activeUser.id,
        username: activeUser.username,
        full_name: activeUser.full_name,
        avatar_url: activeUser.avatar_url,
        points_balance: activeUser.points_balance,
        user_tier: activeUser.user_tier,
        is_verified_seller: activeUser.is_verified_seller
      }]);

      const { data: dbPost, error: postErr } = await supabase
        .from('posts')
        .insert([{
          user_id: activeUser.id,
          title: postPayload.title,
          content: postPayload.content || '',
          post_type: postPayload.post_type,
          likes_count: 0,
          views_count: 1
        }])
        .select()
        .single();

      if (postErr) {
        alert(`❌ ไม่สามารถบันทึกกระทู้ได้: ${postErr.message}`);
        setToast({ type: 'error', message: `❌ บันทึกล้มเหลว: ${postErr.message}` });
        return;
      }

      if (postPayload.mediaItems && postPayload.mediaItems.length > 0) {
        for (const item of postPayload.mediaItems) {
          let mediaUrl = item.previewUrl;
          if (item.file) {
            const folder = item.type === 'video' ? 'videos' : 'posts';
            const { url: publicUrl } = await uploadFileToSupabase(item.file, folder);
            if (publicUrl) mediaUrl = publicUrl;
          }
          await supabase.from('post_media').insert([{
            post_id: dbPost.id,
            media_url: mediaUrl,
            media_type: item.type
          }]);
        }
      }

      if (postPayload.post_type === 'marketplace' && postPayload.products && postPayload.products.length > 0) {
        for (const prod of postPayload.products) {
          if (!prod.name) continue;

          const { data: dbProd } = await supabase.from('products').insert([{
            post_id: dbPost.id,
            name: prod.name,
            description: prod.description || '',
            price: Number(prod.price) || 0,
            condition: 'new',
            is_available: true
          }]).select().single();

          if (dbProd && prod.imageItems && prod.imageItems.length > 0) {
            for (let iIdx = 0; iIdx < prod.imageItems.length; iIdx++) {
              const item = prod.imageItems[iIdx];
              let imgUrl = item.previewUrl;
              if (item.file) {
                const { url: publicUrl } = await uploadFileToSupabase(item.file, 'products');
                if (publicUrl) imgUrl = publicUrl;
              }
              await supabase.from('product_images').insert([{
                product_id: dbProd.id,
                image_url: imgUrl,
                display_order: iIdx
              }]);
            }
          }
        }
      }

      alert('✅ สร้างกระทู้จากหน้าโปรไฟล์สำเร็จเรียบร้อยแล้ว!');
      setToast({ type: 'success', message: '✅ สร้างกระทู้สำเร็จ!' });
      await fetchProfileAndPosts();
    } catch (err: any) {
      alert(`❌ ข้อผิดพลาด: ${err.message || err}`);
    }
  };

  // Delete Post
  const handleDeletePost = async (postId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบกระทู้นี้ออกจากระบบ?')) return;
    setToast({ type: 'info', message: '⏳ กำลังลบกระทู้ออกจาก Supabase...' });

    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) {
        alert(`❌ ไม่สามารถลบกระทู้ได้: ${error.message}`);
      } else {
        alert('✅ ลบกระทู้ออกจากระบบเรียบร้อยแล้ว!');
        await fetchProfileAndPosts();
      }
    } catch (err: any) {
      alert(`❌ ข้อผิดพลาด: ${err.message}`);
    }
  };

  // Save Edit Post
  const handleSaveUpdatePost = async (updatedData: { id: string; title: string; content: string; products: Array<{ id?: string; name: string; price: number }> }) => {
    setToast({ type: 'info', message: '⏳ กำลังบันทึกการแก้ไขไปยัง Supabase...' });

    try {
      const { error: postErr } = await supabase.from('posts').update({
        title: updatedData.title,
        content: updatedData.content
      }).eq('id', updatedData.id);

      if (postErr) {
        alert(`❌ แก้ไขกระทู้ไม่สำเร็จ: ${postErr.message}`);
        return;
      }

      if (updatedData.products && updatedData.products.length > 0) {
        for (const prod of updatedData.products) {
          if (prod.id) {
            await supabase.from('products').update({
              name: prod.name,
              price: prod.price
            }).eq('id', prod.id);
          }
        }
      }

      alert('✅ แก้ไขกระทู้และบันทึกลง Supabase สำเร็จ!');
      await fetchProfileAndPosts();
    } catch (err: any) {
      alert(`❌ ข้อผิดพลาด: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-gray-900 pb-12 relative">
      <ToastAlert toast={toast} onClose={() => setToast(null)} />

      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Profile Banner Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Custom Cover Banner */}
          <div className="h-36 sm:h-44 w-full bg-gray-900 relative">
            <img
              src={user.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200'}
              alt="cover"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 relative pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
              <div className="flex items-end gap-4">
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  style={{ width: '96px', height: '96px' }}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md shrink-0 bg-white"
                />
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold text-gray-900">{user.full_name}</h1>
                    {user.is_verified_seller && (
                      <span className="text-blue-500" title="ผู้ขายยืนยันตัวตนแล้ว">
                        <CheckCircle2 className="w-5 h-5 fill-blue-500 text-white" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-blue-600 font-extrabold">@{user.username}</p>
                </div>
              </div>

              {/* Status Pills & Edit Profile Button */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <Crown className="w-4 h-4 text-amber-600" /> {user.user_tier.toUpperCase()} Member
                </span>
                <span className="bg-blue-100 text-blue-900 text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <Coins className="w-4 h-4 text-blue-600" /> {user.points_balance} แต้ม (ส่วนตัว)
                </span>
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <UserEdit className="w-4 h-4" />
                  <span>แก้ไขโปรไฟล์</span>
                </button>
              </div>
            </div>

            {/* Bio / Description */}
            {user.bio && (
              <p className="text-xs text-gray-700 font-medium pb-2 leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Linktree-Style Social Links Display */}
            {user.social_links && user.social_links.length > 0 && (
              <div className="pt-1 pb-3 border-t border-gray-100">
                <SocialLinksDisplay links={user.social_links} />
              </div>
            )}

            {/* Seller Verification Status */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 mt-2">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>สถานะผู้ขาย: ได้รับการตรวจสอบและยืนยันตัวตนเรียบร้อยแล้ว (Seller Verified)</span>
              </div>
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">ยืนยันแล้ว</span>
            </div>
          </div>
        </div>

        {/* Dashboard Header & Create Post Action */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-blue-600" /> กระทู้และรายการสินค้าของคุณ ({myPosts.length})
          </h2>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> สร้างกระทู้ใหม่ / ลงขายสินค้า
          </button>
        </div>

        {/* My Posts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-8 rounded-2xl text-center text-xs text-gray-500 border border-gray-200 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <p className="font-bold">กำลังโหลดรายการกระทู้ของคุณ...</p>
            </div>
          ) : myPosts.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center text-xs text-gray-500 border border-gray-200 space-y-3">
              <p>คุณยังไม่ได้ลงกระทู้หรือสินค้าในระบบ</p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition"
              >
                + สร้างกระทู้แรกของคุณ
              </button>
            </div>
          ) : (
            myPosts.map((post) => (
              <div key={post.id} className="relative group">
                <div className="bg-gray-100 px-4 py-2 rounded-t-2xl border border-b-0 border-gray-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700 text-[11px]">จัดการกระทู้ ID: {post.id.substring(0, 8)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditPost(post)}
                      className="flex items-center gap-1 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 font-bold px-2.5 py-1 rounded-lg transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> แก้ไขกระทู้
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="flex items-center gap-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold px-2.5 py-1 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> ลบกระทู้
                    </button>
                  </div>
                </div>

                <PostCard post={post} currentUser={user} />
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        profile={user}
        onClose={() => setIsEditProfileOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

      <EditPostModal
        isOpen={!!editPost}
        post={editPost}
        onClose={() => setEditPost(null)}
        onSaveUpdate={handleSaveUpdatePost}
      />

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitPost={handleCreatePostFromProfile}
      />
    </div>
  );
}

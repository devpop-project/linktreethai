'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { createClient } from '../../lib/supabase/client';
import { Profile, Post } from '../../lib/supabase/types';
import { PostCard } from '../../components/PostCard';
import { ChatDrawer } from '../../components/ChatDrawer';
import { ShoppingBag, Search, Filter, ShieldCheck, Tag } from 'lucide-react';

const defaultProfile: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  username: 'pantip_lover',
  full_name: 'คุณกิตติศักดิ์ (Seller Pro)',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  points_balance: 500,
  user_tier: 'vip',
  is_verified_seller: true,
};

export default function MarketplacePage() {
  const supabase = createClient();
  const [user, setUser] = useState<Profile>(defaultProfile);
  const [marketplacePosts, setMarketplacePosts] = useState<Post[]>([]);

  // Chat Drawer State
  const [chatState, setChatState] = useState<{ isOpen: boolean; sellerName: string; productName: string }>({
    isOpen: false,
    sellerName: '',
    productName: ''
  });

  useEffect(() => {
    const loadMarketplace = async () => {
      const { data: postsData } = await supabase
        .from('posts')
        .select(`*, profile:profiles(*), products(*, images:product_images(*)), media:post_media(*)`)
        .eq('post_type', 'marketplace')
        .order('created_at', { ascending: false });

      if (postsData && postsData.length > 0) {
        setMarketplacePosts(postsData as Post[]);
      } else {
        // Fallback sample marketplace post
        setMarketplacePosts([
          {
            id: 'm_demo_1',
            user_id: defaultProfile.id,
            title: 'ตลาด Pantip MALL - แผงค้าอุปกรณ์ไอที กล้อง และ Gadgets ยอดฮิต',
            content: 'รวมสินค้าราคาพิเศษ การันตีสภาพดี สั่งซื้อหรือทักแชตคุยกับผู้ขายได้โดยตรงผ่านหน้าเว็บครับ!',
            post_type: 'marketplace',
            likes_count: 56,
            views_count: 980,
            created_at: new Date().toISOString(),
            profile: defaultProfile,
            products: [
              {
                id: 'p_101',
                post_id: 'm_demo_1',
                name: 'กล้อง Mirrorless Sony A7IV สภาพสวย 98%',
                description: 'ชัตเตอร์น้อย ประกันศูนย์เหลือ 6 เดือน',
                price: 68500,
                stock: 1,
                condition: 'used',
                is_available: true,
                images: [{ id: 'img_101', product_id: 'p_101', image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', display_order: 1 }]
              },
              {
                id: 'p_102',
                post_id: 'm_demo_1',
                name: 'หูฟังไร้สาย Sony WH-1000XM5 ตัดเสียงรบกวนเทพ',
                description: 'สีดำ สภาพ 99%',
                price: 9900,
                stock: 2,
                condition: 'used',
                is_available: true,
                images: [{ id: 'img_102', product_id: 'p_102', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', display_order: 1 }]
              }
            ]
          }
        ]);
      }
    };
    loadMarketplace();
  }, []);

  const handleOpenChat = (sellerName: string, productName: string) => {
    setChatState({ isOpen: true, sellerName, productName });
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-gray-900 pb-12">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* Marketplace Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-emerald-200" />
              <h1 className="text-2xl font-black">ตลาดออนไลน์ Pantip MALL</h1>
            </div>
            <p className="text-xs text-emerald-100">แหล่งรวมสินค้าคุณภาพจากผู้ขายยืนยันตัวตน ลงขายได้หลายรายการในกระทู้เดียว</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>การันตีสินค้าโดยผู้ขายยืนยันตัวตน (Seller Warranty)</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-gray-800">หมวดหมู่:</span>
            <select className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 outline-none font-semibold text-gray-700">
              <option value="all">ทั้งหมด</option>
              <option value="gadget">ไอที & Gadget</option>
              <option value="camera">กล้องถ่ายรูป</option>
              <option value="fashion">แฟชั่น & เสื้อผ้า</option>
            </select>
          </div>

          <div className="text-gray-500 font-medium">
            พบแผงค้าทั้งหมด ({marketplacePosts.length} กระทู้)
          </div>
        </div>

        {/* Marketplace Feed */}
        <div className="space-y-4">
          {marketplacePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onOpenChatWithSeller={handleOpenChat}
            />
          ))}
        </div>
      </main>

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={chatState.isOpen}
        sellerName={chatState.sellerName}
        productName={chatState.productName}
        onClose={() => setChatState({ ...chatState, isOpen: false })}
      />
    </div>
  );
}

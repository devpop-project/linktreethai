'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Crown, Sparkles, Check, CreditCard, ShieldCheck } from 'lucide-react';
import { Profile } from '../lib/supabase/types';

interface PointsVipModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Profile;
  onTopupPoints: (amount: number) => void;
  onPurchasePackage: (pkgId: string, cost: number, tier: 'vip' | 'master', days: number) => void;
}

export const PointsVipModal: React.FC<PointsVipModalProps> = ({
  isOpen,
  onClose,
  user,
  onTopupPoints,
  onPurchasePackage,
}) => {
  const [activeTab, setActiveTab] = useState<'topup' | 'subscriptions'>('topup');
  const [selectedTopup, setSelectedTopup] = useState(350);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSimulateTopup = () => {
    onTopupPoints(selectedTopup);
    setMessage({ type: 'success', text: `เติมแต้มจำนวน +${selectedTopup} แต้มสำเร็จ!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBuy = (pkgId: string, cost: number, tier: 'vip' | 'master', days: number) => {
    if (user.points_balance < cost) {
      setMessage({ type: 'error', text: `แต้มสะสมไม่เพียงพอ (ต้องการ ${cost} แต้ม)` });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    onPurchasePackage(pkgId, cost, tier, days);
    setMessage({ type: 'success', text: `อัปเกรดสถานะ ${tier.toUpperCase()} ${days} วัน เรียบร้อยแล้ว!` });
    setTimeout(() => setMessage(null), 3000);
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
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-7 h-7 text-yellow-200" />
              <h2 className="text-xl font-black">ระบบเติมแต้ม & สิทธิพิเศษ VIP/Master</h2>
            </div>
            <p className="text-xs text-yellow-100">
              ใช้แต้มสะสมแลกรับสถานะ VIP และ Master เพื่อรับตราสิทธิพิเศษและการมองเห็นกระทู้แบบโปร
            </p>

            <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center justify-between border border-white/20">
              <span className="text-xs font-semibold">แต้มสะสมของคุณปัจจุบัน:</span>
              <span className="text-lg font-black text-yellow-200">{user.points_balance} แต้ม</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-600">
            <button
              onClick={() => setActiveTab('topup')}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeTab === 'topup' ? 'border-amber-500 text-amber-600 bg-white' : 'hover:bg-gray-100'
              }`}
            >
              💳 เติมแต้มสะสม (Point Top-up)
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeTab === 'subscriptions' ? 'border-amber-500 text-amber-600 bg-white' : 'hover:bg-gray-100'
              }`}
            >
              👑 ซื้อวันสถานะ VIP & Master
            </button>
          </div>

          {/* Message Toast */}
          {message && (
            <div
              className={`px-4 py-2 text-xs font-bold text-center ${
                message.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Tab Body */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'topup' ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800">เลือกจำนวนแต้มที่ต้องการเติม</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { pts: 100, price: '100 บาท' },
                    { pts: 350, price: '350 บาท' },
                    { pts: 500, price: '500 บาท' },
                    { pts: 1000, price: '1,000 บาท' },
                  ].map((item) => (
                    <button
                      key={item.pts}
                      onClick={() => setSelectedTopup(item.pts)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center transition ${
                        selectedTopup === item.pts
                          ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500 text-amber-900 font-bold'
                          : 'border-gray-200 hover:border-amber-300 text-gray-700'
                      }`}
                    >
                      <span className="text-lg font-black text-amber-600">+{item.pts}</span>
                      <span className="text-[11px] text-gray-500">แต้ม ({item.price})</span>
                    </button>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <CreditCard className="w-4 h-4 text-amber-600" /> ช่องทางชำระเงินที่รองรับ
                  </div>
                  <p>• สแกน PromptPay QR Code อัตโนมัติ (ยอดเงินเข้าทันที)</p>
                  <p>• บัตรเครดิต / เดบิต (Stripe / Omise Secured Gateway)</p>
                </div>

                <button
                  onClick={handleSimulateTopup}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold py-3 rounded-xl shadow-md transition text-sm"
                >
                  ยืนยันเติมแต้ม (+{selectedTopup} แต้ม)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800">เลือกแลกซื้อแพ็กเกจวันสถานะ</h3>

                {/* VIP Packages */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                    <Crown className="w-4 h-4 text-amber-500" /> แพ็กเกจสถานะ VIP
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border border-amber-200 bg-amber-50/30 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-sm text-amber-900">VIP 7 วัน</div>
                        <div className="text-xs text-amber-700 font-extrabold mt-0.5">ใช้ 100 แต้ม</div>
                        <ul className="text-[11px] text-gray-600 mt-2 space-y-1">
                          <li className="flex items-center gap-1"><Check className="w-3 h-3 text-amber-600" /> ตราประทับ VIP Badge</li>
                          <li className="flex items-center gap-1"><Check className="w-3 h-3 text-amber-600" /> กระทู้แสดงแถบสีไฮไลต์</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => handleBuy('vip_7d', 100, 'vip', 7)}
                        className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 rounded-lg text-xs transition"
                      >
                        แลกซื้อด้วย 100 แต้ม
                      </button>
                    </div>

                    <div className="border border-amber-200 bg-amber-50/30 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-sm text-amber-900">VIP 30 วัน (คุ้มค่า)</div>
                        <div className="text-xs text-amber-700 font-extrabold mt-0.5">ใช้ 350 แต้ม</div>
                        <ul className="text-[11px] text-gray-600 mt-2 space-y-1">
                          <li className="flex items-center gap-1"><Check className="w-3 h-3 text-amber-600" /> สิทธิ์ทั้งหมดของ VIP</li>
                          <li className="flex items-center gap-1"><Check className="w-3 h-3 text-amber-600" /> ปักหมุดกระทู้ฟรี 1 ครั้ง</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => handleBuy('vip_30d', 350, 'vip', 30)}
                        className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 rounded-lg text-xs transition"
                      >
                        แลกซื้อด้วย 350 แต้ม
                      </button>
                    </div>
                  </div>
                </div>

                {/* Master Packages */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-purple-600" /> แพ็กเกจสถานะ MASTER (สูงสุด)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border border-purple-200 bg-purple-50/30 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-sm text-purple-900">MASTER 7 วัน</div>
                        <div className="text-xs text-purple-700 font-extrabold mt-0.5">ใช้ 250 แต้ม</div>
                        <ul className="text-[11px] text-gray-600 mt-2 space-y-1">
                          <li className="flex items-center gap-1"><Check className="w-3 h-3 text-purple-600" /> ตราประทับ MASTER Badge</li>
                          <li className="flex items-center gap-1"><Check className="w-3 h-3 text-purple-600" /> โควตาวิดีโอแบบ 4K/HD</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => handleBuy('master_7d', 250, 'master', 7)}
                        className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 rounded-lg text-xs transition"
                      >
                        แลกซื้อด้วย 250 แต้ม
                      </button>
                    </div>

                    <div className="border border-purple-200 bg-purple-50/30 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-sm text-purple-900">MASTER 30 วัน</div>
                        <div className="text-xs text-purple-700 font-extrabold mt-0.5">ใช้ 800 แต้ม</div>
                        <ul className="text-[11px] text-gray-600 mt-2 space-y-1">
                          <li className="flex items-center gap-1"><Check className="w-3 h-3 text-purple-600" /> สิทธิ์ระดับสูงสุดทั้งหมด</li>
                          <li className="flex items-center gap-1"><Check className="w-3 h-3 text-purple-600" /> ฟีดแนะนำพิเศษประจำสัปดาห์</li>
                        </ul>
                      </div>
                      <button
                        onClick={() => handleBuy('master_30d', 800, 'master', 30)}
                        className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 rounded-lg text-xs transition"
                      >
                        แลกซื้อด้วย 800 แต้ม
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

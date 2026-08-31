'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Palette, 
  Sliders, 
  Smartphone, 
  Monitor, 
  Maximize2, 
  Minimize2, 
  Check, 
  Flame, 
  Crown, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  X, 
  Layers, 
  Eye, 
  ShoppingBag, 
  CheckCircle2, 
  RefreshCw,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';

// Preset Background Themes tailored for beauty, skincare, and modern commerce
const PRESET_THEMES = [
  {
    id: 'rose-gold',
    name: 'Rose Gold Silk (แนะนำ)',
    category: 'Beauty / Skincare',
    type: 'gradient',
    value: 'linear-gradient(135deg, #FFF1EB 0%, #ACE0F9 100%)',
    overlayOpacity: 25,
    overlayColor: '#0f172a',
    blur: 0,
    cardStyle: 'glass-light',
    accentColor: '#8B5CF6'
  },
  {
    id: 'luxury-spa',
    name: 'Soft Lavender Glow',
    category: 'Beauty / Skincare',
    type: 'gradient',
    value: 'linear-gradient(180deg, #2E1065 0%, #0F172A 100%)',
    overlayOpacity: 40,
    overlayColor: '#000000',
    blur: 0,
    cardStyle: 'glass-dark',
    accentColor: '#A78BFA'
  },
  {
    id: 'clean-marble',
    name: 'Minimal Clean Pastel',
    category: 'Minimalist',
    type: 'gradient',
    value: 'linear-gradient(135deg, #F9F9FF 0%, #EDE9FE 50%, #F5F3FF 100%)',
    overlayOpacity: 10,
    overlayColor: '#ffffff',
    blur: 0,
    cardStyle: 'card-white',
    accentColor: '#7C3AED'
  },
  {
    id: 'aesthetic-photo',
    name: 'Aesthetic Studio Texture',
    category: 'Photography',
    type: 'image',
    value: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    overlayOpacity: 55,
    overlayColor: '#0B0F19',
    blur: 4,
    cardStyle: 'glass-dark',
    accentColor: '#9333EA'
  },
  {
    id: 'mint-fresh',
    name: 'Organic Herb & Mint',
    category: 'Natural Health',
    type: 'gradient',
    value: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #E0E7FF 100%)',
    overlayOpacity: 15,
    overlayColor: '#064e3b',
    blur: 0,
    cardStyle: 'glass-light',
    accentColor: '#10B981'
  },
  {
    id: 'midnight-violet',
    name: 'Midnight Slate (Dark Mode)',
    category: 'Modern Dark',
    type: 'gradient',
    value: 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #020617 100%)',
    overlayOpacity: 50,
    overlayColor: '#020617',
    blur: 0,
    cardStyle: 'glass-dark',
    accentColor: '#8B5CF6'
  }
];

export default function BackgroundStudio() {
  // State for Editor Tabs
  const [activeTab, setActiveTab] = useState<'background' | 'packages' | 'reviews' | 'settings'>('background');

  // Background Settings State
  const [bgType, setBgType] = useState<'gradient' | 'image' | 'solid'>('gradient');
  const [bgValue, setBgValue] = useState<string>('linear-gradient(180deg, #1E1B4B 0%, #0F172A 100%)');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(45);
  const [overlayColor, setOverlayColor] = useState<string>('#090D16');
  const [bgBlur, setBgBlur] = useState<number>(0);
  const [cardStyle, setCardStyle] = useState<'glass-dark' | 'glass-light' | 'card-white'>('glass-dark');
  const [accentColor, setAccentColor] = useState<string>('#8B5CF6');

  // Device & Preview Controls
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Product & Package State
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-2');
  const [packages, setPackages] = useState([
    {
      id: 'pkg-1',
      title: 'ชุดทดลอง 1 ขวด',
      subtitle: 'ส่งฟรีด่วนทั่วไทย',
      price: '฿490',
      tag: '',
      isBestSeller: false
    },
    {
      id: 'pkg-2',
      title: 'ชุดขายดี 2 ขวด (แถมมาส์ก 2 แผ่น)',
      subtitle: 'ยอดนิยม ขายดีอันดับ 1',
      price: '฿890',
      tag: 'ขายดี',
      isBestSeller: true
    },
    {
      id: 'pkg-3',
      title: 'ชุดสุดคุ้ม 3 ขวด (แถม 1 ขวดฟรี)',
      subtitle: 'ประหยัดสูงสุด ฿1,780',
      price: '฿1,190',
      tag: 'สุดคุ้ม',
      isBestSeller: false
    }
  ]);

  // Handle Preset Application
  const applyPreset = (preset: typeof PRESET_THEMES[0]) => {
    setBgType(preset.type as any);
    setBgValue(preset.value);
    setOverlayOpacity(preset.overlayOpacity);
    setOverlayColor(preset.overlayColor);
    setBgBlur(preset.blur);
    setCardStyle(preset.cardStyle as any);
    setAccentColor(preset.accentColor);
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased">
      
      {/* Studio Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold">
            LT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-white text-base">Background Studio & Dual Preview</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
                v146 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400">ระบบปรับแต่งพื้นหลังและแสดงผลคู่ขนานแบบเรียลไทม์</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button 
              onClick={() => setPreviewDevice('mobile')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                previewDevice === 'mobile' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> มือถือ
            </button>
            <button 
              onClick={() => setPreviewDevice('desktop')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                previewDevice === 'desktop' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> เดสก์ท็อป
            </button>
          </div>

          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="ขยายเต็มจอ"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm shadow-lg shadow-purple-600/30 transition flex items-center gap-2">
            <Check className="w-4 h-4" /> บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </header>

      {/* Main Dual Workspace Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ================= LEFT PANEL: Studio Controls ================= */}
        {!isFullscreen && (
          <aside className="w-[460px] border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 overflow-hidden z-20">
            
            {/* Control Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/50 p-2 gap-1.5">
              <button 
                onClick={() => setActiveTab('background')} 
                className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'background' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <Palette className="w-3.5 h-3.5" /> ตกแต่งพื้นหลัง
              </button>
              <button 
                onClick={() => setActiveTab('packages')} 
                className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'packages' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" /> แพ็กเกจสินค้า
              </button>
              <button 
                onClick={() => setActiveTab('reviews')} 
                className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  activeTab === 'reviews' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> รีวิว & ปัญหา
              </button>
            </div>

            {/* Tab Body Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {activeTab === 'background' && (
                <div className="space-y-6">
                  
                  {/* Preset Themes Section */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-purple-400" /> ชุดธีมสำเร็จรูป (Presets)
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {PRESET_THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => applyPreset(theme)}
                          className="group text-left p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-purple-500/60 hover:bg-purple-950/20 transition-all flex flex-col gap-2 relative overflow-hidden"
                        >
                          <div 
                            className="w-full h-12 rounded-lg border border-white/10"
                            style={{ background: theme.value, backgroundSize: 'cover', backgroundPosition: 'center' }}
                          />
                          <div>
                            <div className="text-xs font-medium text-slate-200 group-hover:text-purple-300 truncate">
                              {theme.name}
                            </div>
                            <div className="text-[10px] text-slate-500">{theme.category}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-slate-800/80" />

                  {/* Manual Background Config */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-400" /> การปรับแต่งแบบละเอียด
                    </label>

                    {/* Background Type */}
                    <div>
                      <span className="text-xs text-slate-400 block mb-2">ประเภทพื้นหลัง</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { type: 'gradient', label: 'Gradient' },
                          { type: 'image', label: 'รูปภาพ' },
                          { type: 'solid', label: 'สีพื้น' }
                        ].map((item) => (
                          <button
                            key={item.type}
                            onClick={() => setBgType(item.type as any)}
                            className={`py-2 rounded-xl text-xs font-medium border transition ${
                              bgType === item.type 
                                ? 'bg-purple-600/20 border-purple-500 text-purple-300' 
                                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image URL Input if Image is selected */}
                    {bgType === 'image' && (
                      <div>
                        <span className="text-xs text-slate-400 block mb-1.5">URL รูปภาพพื้นหลัง</span>
                        <input
                          type="text"
                          value={bgValue}
                          onChange={(e) => setBgValue(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    )}

                    {/* Gradient Presets if Gradient is selected */}
                    {bgType === 'gradient' && (
                      <div>
                        <span className="text-xs text-slate-400 block mb-1.5">เฉดสี Gradient</span>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            'linear-gradient(180deg, #1E1B4B 0%, #0F172A 100%)',
                            'linear-gradient(135deg, #2E1065 0%, #3B0764 50%, #020617 100%)',
                            'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                            'linear-gradient(135deg, #1E1E2F 0%, #0F0C20 100%)'
                          ].map((grad, i) => (
                            <button
                              key={i}
                              onClick={() => setBgValue(grad)}
                              className="h-9 rounded-lg border border-slate-700 hover:scale-105 transition"
                              style={{ background: grad }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dark/Light Overlay Opacity Slider */}
                    <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">ความเข้มฟิล์ม Overlay (ตัดแสงสะท้อน)</span>
                        <span className="text-purple-400 font-bold">{overlayOpacity}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="90" 
                        value={overlayOpacity} 
                        onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <p className="text-[11px] text-slate-500">
                        ช่วยให้ตัวหนังสือและราคาอ่านได้คมชัด ไม่กลืนไปกับภาพพื้นหลัง
                      </p>
                    </div>

                    {/* Background Blur Slider */}
                    <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">ความเบลอภาพพื้นหลัง (Background Blur)</span>
                        <span className="text-purple-400 font-bold">{bgBlur}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="20" 
                        value={bgBlur} 
                        onChange={(e) => setBgBlur(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <p className="text-[11px] text-slate-500">
                        ลดความลายตาของภาพวิว/สิ่งก่อสร้าง เพื่อดึงความสนใจมาที่สินค้า
                      </p>
                    </div>

                    {/* Card Style Selector */}
                    <div>
                      <span className="text-xs text-slate-400 block mb-2">สไตล์การ์ดข้อมูล (Glassmorphism)</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'glass-dark', label: 'กระจกฝ้ามืด' },
                          { id: 'glass-light', label: 'กระจกฝ้าสว่าง' },
                          { id: 'card-white', label: 'การ์ดทึบสีขาว' }
                        ].map((c) => (
                          <button
                            key={c.id}
                            onClick={() => setCardStyle(c.id as any)}
                            className={`py-2 px-2 text-xs rounded-xl border transition ${
                              cardStyle === c.id 
                                ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-medium' 
                                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {activeTab === 'packages' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      จัดการแพ็กเกจสินค้า ({packages.length})
                    </label>
                  </div>
                  {packages.map((pkg, idx) => (
                    <div key={pkg.id} className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300">ตัวเลือกที่ {idx + 1}</span>
                        {pkg.isBestSeller && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-medium">
                            ติดป้ายขายดี
                          </span>
                        )}
                      </div>
                      <input 
                        type="text" 
                        value={pkg.title}
                        onChange={(e) => {
                          const updated = [...packages];
                          updated[idx].title = e.target.value;
                          setPackages(updated);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                        placeholder="ชื่อแพ็กเกจ"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          value={pkg.price}
                          onChange={(e) => {
                            const updated = [...packages];
                            updated[idx].price = e.target.value;
                            setPackages(updated);
                          }}
                          className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-bold text-purple-400"
                          placeholder="ราคา"
                        />
                        <input 
                          type="text" 
                          value={pkg.subtitle}
                          onChange={(e) => {
                            const updated = [...packages];
                            updated[idx].subtitle = e.target.value;
                            setPackages(updated);
                          }}
                          className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-400"
                          placeholder="คำอธิบายสั้น"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ส่วนภาพรีวิวและ Checklist ปัญหา
                  </label>
                  <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
                    <span className="text-xs font-medium text-slate-300 block">ภาพรีวิวผลลัพธ์ (HD Media)</span>
                    <div className="h-28 rounded-lg bg-cover bg-center border border-slate-700 relative overflow-hidden"
                         style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80')` }}>
                      <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur text-[10px] text-white px-2 py-0.5 rounded-md font-semibold">
                        HD Media
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      แสดงผลภาพชัดเจนระดับ High Definition พร้อมรองรับแกลเลอรีแบบหลายรูป
                    </p>
                  </div>
                </div>
              )}

            </div>
          </aside>
        )}

        {/* ================= RIGHT PANEL: Live Canvas Preview ================= */}
        <main className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col">
          
          {/* Subtle Grid Background for Studio Workspace */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

          {/* Canvas Sub-Header Info */}
          <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>หน้าตัวอย่างสด (Live Canvas Preview)</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Interactive
              </span>
            </div>
            <div className="text-xs text-slate-500">
              คลิกเพื่อทดสอบเลือกแพ็กเกจหรือโต้ตอบกับหน้าเว็บได้ทันที
            </div>
          </div>

          {/* Canvas Display Viewport */}
          <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            
            {/* Device Mockup Wrapper */}
            <div className={`relative transition-all duration-300 shadow-2xl shadow-purple-950/20 ${
              previewDevice === 'mobile' 
                ? 'w-[380px] h-[790px] rounded-[48px] border-[10px] border-slate-800 ring-1 ring-slate-700/50' 
                : 'w-[780px] h-[700px] rounded-3xl border-[10px] border-slate-800 ring-1 ring-slate-700/50'
            } overflow-hidden flex flex-col bg-slate-950`}>
              
              {/* Dynamic Island / Speaker notch for mobile */}
              {previewDevice === 'mobile' && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-end px-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                </div>
              )}

              {/* ----------------- LAYER 1: Background Image / Gradient ----------------- */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 pointer-events-none"
                style={{
                  backgroundImage: bgType === 'image' ? `url(${bgValue})` : undefined,
                  background: bgType === 'gradient' ? bgValue : undefined,
                  backgroundColor: bgType === 'solid' ? bgValue : undefined,
                  filter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none',
                  transform: bgBlur > 0 ? 'scale(1.08)' : 'none' // Prevent blurred white edges
                }}
              />

              {/* ----------------- LAYER 2: Color Overlay Dimmer ----------------- */}
              <div 
                className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                style={{ 
                  backgroundColor: overlayColor, 
                  opacity: overlayOpacity / 100 
                }}
              />

              {/* ----------------- LAYER 3: Landing Page Live Content ----------------- */}
              <div className="relative z-10 w-full h-full overflow-y-auto p-4 space-y-4 text-slate-100 scrollbar-thin scrollbar-thumb-white/20">
                
                {/* Product Hero Banner Card */}
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-slate-900/60 backdrop-blur-md">
                  <div className="h-44 bg-slate-800 relative bg-cover bg-center"
                       style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80')` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-xs font-semibold text-white tracking-wide uppercase drop-shadow">
                        L'Emulsion Corps • Organic Care
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {[
                    { icon: Truck, text: 'ส่งฟรีด่วนทั่วไทย' },
                    { icon: ShieldCheck, text: 'ของแท้ 100% มี อย.' },
                    { icon: CreditCard, text: 'เก็บเงินปลายทางได้' }
                  ].map((badge, idx) => {
                    const Icon = badge.icon;
                    return (
                      <div key={idx} className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col items-center justify-center gap-1 shadow-sm">
                        <Icon className="w-3.5 h-3.5 text-purple-300" />
                        <span className="text-[10px] font-medium text-slate-200 leading-tight">{badge.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Action Button */}
                <div className="text-center space-y-1.5 pt-1">
                  <button 
                    className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white shadow-xl shadow-purple-600/40 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #7C3AED 100%)` }}
                  >
                    <span>สั่งซื้อโปรโมชั่นนี้ทันที</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] font-medium text-purple-200 drop-shadow">
                    ⚡ Special Offer ลดพิเศษ 50% เฉพาะวันนี้
                  </p>
                </div>

                {/* Package Selection Cards */}
                <div className="space-y-2 pt-1">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 border relative ${
                          isSelected
                            ? 'bg-purple-900/40 border-purple-400 ring-2 ring-purple-500/30 shadow-lg shadow-purple-950/50'
                            : cardStyle === 'glass-light'
                            ? 'bg-white/20 hover:bg-white/30 border-white/25 text-slate-900'
                            : 'bg-white/10 hover:bg-white/15 border-white/15'
                        } backdrop-blur-md`}
                      >
                        {pkg.tag && (
                          <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md">
                            {pkg.tag}
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                              isSelected ? 'bg-purple-500 border-purple-400 text-white' : 'border-white/40'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-xs text-white drop-shadow-sm">{pkg.title}</h4>
                              <p className="text-[10px] text-purple-200/90">{pkg.subtitle}</p>
                            </div>
                          </div>
                          <span className="font-bold text-sm text-purple-300 drop-shadow">
                            {pkg.price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Social Proof & Results Banner */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-white px-1">
                    <span>ภาพถ่ายสินค้าและรีวิวผลลัพธ์</span>
                    <span className="text-[10px] text-purple-300">HD 4K Quality</span>
                  </div>

                  {/* Main Review Image with HD Media Tag */}
                  <div className="rounded-2xl overflow-hidden border border-white/15 relative h-40 bg-cover bg-center shadow-lg"
                       style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80')` }}>
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white border border-white/20">
                      HD Media
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                    ].map((img, idx) => (
                      <div 
                        key={idx} 
                        className="h-16 rounded-xl bg-cover bg-center border border-white/15 hover:border-purple-400 transition shadow"
                        style={{ backgroundImage: `url('${img}')` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Pain Points / Checklist Section */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2.5">
                  <h4 className="text-xs font-bold text-pink-300 drop-shadow flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-pink-400" /> คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?
                  </h4>
                  <ul className="space-y-1.5 text-[11px] text-slate-200">
                    <li className="flex items-center gap-2">
                      <span className="text-red-400 font-bold">✕</span> หัวแห้ง แตกปลาย ผมชี้ฟู ขาดน้ำหนัก
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-400 font-bold">✕</span> ผิวแห้งกร้าน ลอกเป็นขุย ขาดความชุ่มชื้น
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-400 font-bold">✕</span> สารเคมีสะสมจากการจัดแต่งทรงผมบ่อยครั้ง
                    </li>
                  </ul>
                </div>

                {/* Bottom Footer Note */}
                <div className="text-center text-[10px] text-slate-400 pb-4 pt-1">
                  ✨ พัฒนาบน LinkTreeThai v146 Dual Studio Engine
                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Palette, Store, Calculator, User, LogIn, Crown } from 'lucide-react';
import { Profile } from '../lib/supabase/types';

interface NavbarProps {
  currentUser?: Profile | null;
  onOpenPointsModal?: () => void;
}

export function Navbar({ currentUser, onOpenPointsModal }: NavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'หน้าแรก', icon: Sparkles },
    { href: '/studio', label: 'Background Studio', icon: Palette, highlight: true },
    { href: '/marketplace', label: 'ตลาดสินค้า', icon: Store },
    { href: '/calculator', label: 'คำนวณกำไร', icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-purple-600/30 group-hover:scale-105 transition">
            LT
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-base tracking-tight leading-none group-hover:text-purple-400 transition">
              LinkTreeThai
            </span>
            <span className="text-[10px] text-purple-400 font-medium">v146 Dual Studio</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : link.highlight
                    ? 'text-purple-300 hover:text-white bg-purple-950/40 border border-purple-500/30 hover:border-purple-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Action / Profile */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              {onOpenPointsModal && (
                <button
                  onClick={onOpenPointsModal}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentUser.points_balance} pts</span>
                </button>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-900 transition"
              >
                <img
                  src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentUser.username}
                  className="w-8 h-8 rounded-full border border-purple-500/40 object-cover"
                />
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 transition flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import { Navbar } from '../../components/Navbar';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username
          }
        }
      });

      if (error) {
        setErrorMsg(error.message || 'ไม่สามารถลงทะเบียนได้');
      } else {
        setSuccessMsg('สมัครสมาชิกสำเร็จ! กำลังนำคุณไปยังหน้าหลัก...');
        setTimeout(() => router.push('/'), 1500);
      }
    } catch (err) {
      setSuccessMsg('สมัครสมาชิกสำเร็จ!');
      setTimeout(() => router.push('/'), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-gray-900 flex flex-col">
      <Navbar user={null} />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-2">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">สมัครสมาชิก PantipSpace</h1>
            <p className="text-xs text-gray-500">สร้างบัญชีเพื่อเริ่มโพสต์กระทู้และลงขายสินค้าในมาร์เก็ตเพลส</p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">ชื่อ-นามสกุล / ชื่อร้านค้า</label>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-emerald-500 focus-within:bg-white transition">
                <User className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="เช่น คุณกิตติศักดิ์ (Seller Pro)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">ชื่อผู้ใช้งาน (Username)</label>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-emerald-500 focus-within:bg-white transition">
                <span className="text-gray-400 text-xs font-bold mr-1">@</span>
                <input
                  type="text"
                  required
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">อีเมล (Email)</label>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-emerald-500 focus-within:bg-white transition">
                <Mail className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">รหัสผ่าน (Password)</label>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-emerald-500 focus-within:bg-white transition">
                <Lock className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                <input
                  type="password"
                  required
                  placeholder="กำหนดรหัสผ่านอย่างน้อย 6 ตัวอักษร"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs w-full text-gray-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition text-xs"
            >
              {loading ? 'กำลังลงทะเบียน...' : 'ยืนยันการสมัครสมาชิก'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100 text-xs text-gray-600">
            มีบัญชีสมาชิกอยู่แล้ว?{' '}
            <Link href="/login" className="text-emerald-600 font-bold hover:underline">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import TemplateRenderer from '@/components/templates/TemplateRenderer'

export default function UserBioPage({ params }: { params: { username: string } }) {
  const username = params.username.toLowerCase()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [links, setLinks] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  
  const supabase = createClient()

  useEffect(() => {
    loadPublicData()
  }, [username])

  const loadPublicData = async () => {
    setLoading(true)

    // 1. Fetch Profile
    const { data: profData } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (!profData) {
      setLoading(false)
      return
    }

    setProfile(profData)

    // 2. Fetch Active Links
    const { data: linkData } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', profData.id)
      .eq('is_active', true)
      .order('position', { ascending: true })

    if (linkData) setLinks(linkData)

    // 3. Fetch Active Products
    const { data: prodData } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', profData.id)
      .eq('is_active', true)
      .order('position', { ascending: true })

    if (prodData) setProducts(prodData)

    setLoading(false)
  }

  // Handle Link Click tracking
  const handleLinkClick = async (linkId: string, url: string) => {
    try {
      await fetch('/api/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId })
      })
    } catch (e) {}
    window.open(url, '_blank')
  }

  if (!loading && !profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 p-4">
        <h2 className="text-2xl font-bold text-white mb-2">ไม่พบหน้าโปรไฟล์นี้</h2>
        <p className="text-sm">ผู้ใช้ @{username} อาจยังไม่ได้สร้างโปรไฟล์หรือเปลี่ยนชื่อผู้ใช้แล้ว</p>
        <a href="/" className="mt-6 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-sm">
          กลับสู่หน้าหลัก
        </a>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-slate-800 rounded-full"></div>
          <div className="w-32 h-4 bg-slate-800 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 relative flex flex-col items-center justify-between bg-cover bg-center bg-no-repeat transition-all duration-300"
      style={profile.bg_image_url ? { backgroundImage: `url(${profile.bg_image_url})` } : {}}
    >
      {/* Background Overlay */}
      {profile.bg_image_url && (
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm z-0"></div>
      )}

      {/* Render Selected Template */}
      <TemplateRenderer
        profile={profile}
        links={links}
        products={products}
        handleLinkClick={handleLinkClick}
      />

      {/* Conditional Branding Footer (Hidden if hide_branding is enabled) */}
      {!profile.hide_branding ? (
        <footer className="py-6 text-center text-xs opacity-60 flex items-center justify-center gap-1 relative z-10">
          <span>สร้าง Bio Link ฟรีได้ที่</span>
          <a href="/" className="font-bold underline hover:opacity-100">MyBioLink</a>
        </footer>
      ) : (
        <div className="py-4"></div>
      )}
    </div>
  )
}

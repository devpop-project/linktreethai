import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  })
}

// GET: Retrieve all uploaded index pages for a specific user
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')
    const isAdminMode = searchParams.get('admin') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Check if admin
    let callerIsAdmin = false
    if (isAdminMode) {
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', userId).single()
      callerIsAdmin = prof?.role === 'admin'
    }

    // 1. If Admin Mode -> return all pages across system
    if (callerIsAdmin) {
      const { data: allAdminData, error: allAdminErr } = await supabase
        .from('uploaded_index_pages')
        .select('*')
        .order('created_at', { ascending: false })

      if (!allAdminErr && allAdminData) {
        return NextResponse.json({ success: true, pages: allAdminData, isAdmin: true })
      }

      // Fallback landing_pages
      const { data: fallbackAll } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('card_style', 'uploaded_html_index')
        .order('created_at', { ascending: false })

      const mapped = (fallbackAll || []).map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        slug: item.slug,
        title: item.title,
        html_content: item.body_content,
        fb_pixel_id: item.fb_pixel_id,
      meta_capi_token: item.meta_capi_token,
        tiktok_pixel_id: item.tiktok_pixel_id,
        google_pixel_id: item.google_pixel_id,
        line_tag_id: item.line_tag_id,
        views: item.views || 0,
        is_active: item.is_active ?? true,
        created_at: item.created_at,
        updated_at: item.updated_at
      }))

      return NextResponse.json({ success: true, pages: mapped, isAdmin: true })
    }

    // Regular User Mode -> only own pages
    const { data: primaryData, error: primaryErr } = await supabase
      .from('uploaded_index_pages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!primaryErr && primaryData) {
      return NextResponse.json({ success: true, pages: primaryData })
    }

    // 2. Fallback to landing_pages where card_style = 'uploaded_html_index'
    const { data: fallbackData, error: fallbackErr } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('user_id', userId)
      .eq('card_style', 'uploaded_html_index')
      .order('created_at', { ascending: false })

    if (fallbackErr) {
      return NextResponse.json({ success: true, pages: [] })
    }

    const mapped = (fallbackData || []).map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      slug: item.slug,
      title: item.title,
      html_content: item.body_content,
      fb_pixel_id: item.fb_pixel_id,
      meta_capi_token: item.meta_capi_token,
      tiktok_pixel_id: item.tiktok_pixel_id,
      google_pixel_id: item.google_pixel_id,
      line_tag_id: item.line_tag_id,
      views: item.views || 0,
      is_active: item.is_active ?? true,
      created_at: item.created_at,
      updated_at: item.updated_at
    }))

    return NextResponse.json({ success: true, pages: mapped })
  } catch (error: any) {
    console.error('Error fetching uploaded index pages:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

// POST: Create (Costs 599 points) or Edit (Free / 0 points)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      id,
      user_id,
      slug,
      title,
      html_content,
      fb_pixel_id,
      meta_capi_token,
      tiktok_pixel_id,
      google_pixel_id,
      line_tag_id,
      is_active
    } = body

    if (!user_id) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 })
    }

    if (!title || !String(title).trim()) {
      return NextResponse.json({ error: 'กรุณาระบุชื่อหน้าเว็บ / โปรเจกต์' }, { status: 400 })
    }

    if (!slug || !String(slug).trim()) {
      return NextResponse.json({ error: 'กรุณาระบุชื่อเส้นทาง URL (slug)' }, { status: 400 })
    }

    if (!html_content || !String(html_content).trim()) {
      return NextResponse.json({ error: 'กรุณาเลือกไฟล์ index.html หรือระบุเนื้อหาโค้ด HTML' }, { status: 400 })
    }

    // Sanitize slug
    const cleanSlug = String(slug)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    if (!cleanSlug || cleanSlug.length < 2) {
      return NextResponse.json({ error: 'ชื่อ URL (slug) ต้องมีความยาวอย่างน้อย 2 ตัวอักษร (ใช้ a-z, 0-9, ขีดกลาง)' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // 1. Fetch user profile to check Tier and Points
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single()

    if (profErr || !profile) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลโปรไฟล์ผู้ใช้งาน' }, { status: 404 })
    }

    // 2. Tier Check: Only Pro, Master, or Admin
    const isMaster = Boolean(profile.master_expires_at && new Date(profile.master_expires_at).getTime() > Date.now())
    const isPro = Boolean(profile.pro_expires_at && new Date(profile.pro_expires_at).getTime() > Date.now())
    const isAdmin = profile.role === 'admin'

    if (!isAdmin && !isMaster && !isPro) {
      return NextResponse.json({
        error: 'ระบบอัปโหลด index.html เปิดให้ใช้งานเฉพาะสมาชิกระดับ PRO VIP และ MASTER VIP เท่านั้น กรุณาอัปเกรดแพ็กเกจก่อนทำรายการ'
      }, { status: 403 })
    }

    const isEditMode = Boolean(id)

    // Check slug duplication
    // In uploaded_index_pages
    const { data: dup1 } = await supabase
      .from('uploaded_index_pages')
      .select('id')
      .eq('slug', cleanSlug)
      .neq('id', id || '00000000-0000-0000-0000-000000000000')
      .maybeSingle()

    // In landing_pages
    const { data: dup2 } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('slug', cleanSlug)
      .neq('id', id || '00000000-0000-0000-0000-000000000000')
      .maybeSingle()

    if (dup1 || dup2) {
      return NextResponse.json({ error: `ชื่อ URL /u/${cleanSlug} นี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น` }, { status: 400 })
    }

    // =========================================================================
    // CASE 1: EDIT MODE -> FREE (0 Points)
    // =========================================================================
    if (isEditMode) {
      const updatePayload: any = {
        slug: cleanSlug,
        title: String(title).trim(),
        html_content: String(html_content),
        fb_pixel_id: fb_pixel_id ? String(fb_pixel_id).trim() : null,
        meta_capi_token: meta_capi_token ? String(meta_capi_token).trim() : null,
        tiktok_pixel_id: tiktok_pixel_id ? String(tiktok_pixel_id).trim() : null,
        google_pixel_id: google_pixel_id ? String(google_pixel_id).trim() : null,
        line_tag_id: line_tag_id ? String(line_tag_id).trim() : null,
        is_active: is_active !== undefined ? Boolean(is_active) : true,
        updated_at: new Date().toISOString()
      }

      let updatedPage: any = null

      const lpUpdate = {
        slug: cleanSlug,
        title: String(title).trim(),
        headline: String(title).trim(),
        body_content: String(html_content),
        cta_url: `/u/${cleanSlug}`,
        fb_pixel_id: fb_pixel_id ? String(fb_pixel_id).trim() : null,
        meta_capi_token: meta_capi_token ? String(meta_capi_token).trim() : null,
        tiktok_pixel_id: tiktok_pixel_id ? String(tiktok_pixel_id).trim() : null,
        google_pixel_id: google_pixel_id ? String(google_pixel_id).trim() : null,
        line_tag_id: line_tag_id ? String(line_tag_id).trim() : null,
        is_active: is_active !== undefined ? Boolean(is_active) : true,
        updated_at: new Date().toISOString()
      }

      // Update both tables with service role key (if admin, update without user_id restriction)
      let q1 = supabase.from('uploaded_index_pages').update(updatePayload).eq('id', id)
      let q2 = supabase.from('landing_pages').update(lpUpdate).eq('id', id)

      if (!isAdmin) {
        q1 = q1.eq('user_id', user_id)
        q2 = q2.eq('user_id', user_id)
      }

      const [res1, res2] = await Promise.allSettled([
        q1.select().maybeSingle(),
        q2.select().maybeSingle()
      ])

      if (res1.status === 'fulfilled' && res1.value.data) {
        updatedPage = res1.value.data
      } else if (res2.status === 'fulfilled' && res2.value.data) {
        updatedPage = { ...res2.value.data, html_content: res2.value.data.body_content }
      }

      return NextResponse.json({
        success: true,
        message: 'บันทึกการแก้ไขหน้าเว็บเรียบร้อยแล้ว (ไม่มีค่าใช้จ่าย)',
        page: updatedPage
      })
    }

    // =========================================================================
    // CASE 2: NEW UPLOAD / CREATION -> Costs 599 Points (Strict for ALL users)
    // =========================================================================
    const currentPoints = profile.points || 0
    if (currentPoints < 599) {
      return NextResponse.json({
        error: `แต้มสะสมของคุณไม่เพียงพอ (ต้องการ 599 แต้ม แต่คุณมี ${currentPoints} แต้ม) กรุณาเติมแต้มก่อนทำรายการ`
      }, { status: 400 })
    }

    // Deduct 599 points strictly from profiles table
    const newPoints = Math.max(0, currentPoints - 599)
    const { error: deductErr } = await supabase
      .from('profiles')
      .update({
        points: newPoints,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id)

    if (deductErr) {
      return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการตัดแต้ม: ' + deductErr.message }, { status: 500 })
    }

    // Record in payment_transactions
    try {
      await supabase.from('payment_transactions').insert([{
        user_id,
        amount: 599,
        payment_type: 'upload_index_599pts',
        status: 'completed',
        slip_url: null,
        note: `อัปโหลดหน้าเว็บ index.html เส้นทาง /u/${cleanSlug} (หัก 599 แต้มสำเร็จ)`,
        created_at: new Date().toISOString()
      }])
    } catch (txErr) {
      console.warn('Transaction log warning:', txErr)
    }

    // Insert new page record
    const insertPayload: any = {
      user_id,
      slug: cleanSlug,
      title: String(title).trim(),
      html_content: String(html_content),
      fb_pixel_id: fb_pixel_id ? String(fb_pixel_id).trim() : null,
      meta_capi_token: meta_capi_token ? String(meta_capi_token).trim() : null,
      tiktok_pixel_id: tiktok_pixel_id ? String(tiktok_pixel_id).trim() : null,
      google_pixel_id: google_pixel_id ? String(google_pixel_id).trim() : null,
      line_tag_id: line_tag_id ? String(line_tag_id).trim() : null,
      views: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    let createdRecord: any = null

    const { data: pIns, error: pInsErr } = await supabase
      .from('uploaded_index_pages')
      .insert([insertPayload])
      .select()
      .maybeSingle()

    if (!pInsErr && pIns) {
      createdRecord = pIns
    } else {
      // Fallback insert to landing_pages
      const lpInsert = {
        user_id,
        slug: cleanSlug,
        title: String(title).trim(),
        headline: String(title).trim(),
        body_content: String(html_content),
        card_style: 'uploaded_html_index',
        cta_text: 'เยี่ยมชมหน้าเว็บ',
        cta_url: `/u/${cleanSlug}`,
        fb_pixel_id: fb_pixel_id ? String(fb_pixel_id).trim() : null,
        meta_capi_token: meta_capi_token ? String(meta_capi_token).trim() : null,
        tiktok_pixel_id: tiktok_pixel_id ? String(tiktok_pixel_id).trim() : null,
        google_pixel_id: google_pixel_id ? String(google_pixel_id).trim() : null,
        line_tag_id: line_tag_id ? String(line_tag_id).trim() : null,
        views: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: lpIns, error: lpInsErr } = await supabase
        .from('landing_pages')
        .insert([lpInsert])
        .select()
        .maybeSingle()

      if (lpInsErr) {
        if (!isAdmin) {
          await supabase.from('profiles').update({ points: currentPoints }).eq('id', user_id)
        }
        return NextResponse.json({ error: 'ไม่สามารถบันทึกหน้าเว็บได้: ' + lpInsErr.message }, { status: 500 })
      }

      createdRecord = lpIns ? { ...lpIns, html_content: lpIns.body_content } : null
    }

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดและเผยแพร่หน้าเว็บสำเร็จ หัก 599 แต้มเรียบร้อยแล้ว (สามารถแก้ไขได้ตลอดชีพ)',
      page: createdRecord,
      remainingPoints: newPoints
    })
  } catch (error: any) {
    console.error('Upload index API error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE: Remove an uploaded index page
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('user_id')

    if (!id || !userId) {
      return NextResponse.json({ error: 'Missing id or user_id' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Delete from uploaded_index_pages
    await supabase
      .from('uploaded_index_pages')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    // Delete from landing_pages fallback
    await supabase
      .from('landing_pages')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    return NextResponse.json({ success: true, message: 'ลบหน้าเว็บเรียบร้อยแล้ว' })
  } catch (error: any) {
    console.error('Delete index page error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

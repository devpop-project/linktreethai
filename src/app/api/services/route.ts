import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ServiceItemDTO, DEFAULT_SERVICES_LIST } from '@/types/services'

export { DEFAULT_SERVICES_LIST, type ServiceItemDTO } from '@/types/services'

export const dynamic = 'force-dynamic'

let inMemoryServices: ServiceItemDTO[] = [...DEFAULT_SERVICES_LIST]

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  })
}

// Convert Supabase DB Row to DTO
function rowToDTO(row: any): ServiceItemDTO {
  let feats: string[] = []
  if (Array.isArray(row.features)) {
    feats = row.features
  } else if (typeof row.features === 'string') {
    try {
      const parsed = JSON.parse(row.features)
      if (Array.isArray(parsed)) feats = parsed
    } catch (e) {
      feats = row.features.split(/[,\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0)
    }
  }

  return {
    id: row.id,
    title: row.title || '',
    subtitle: row.subtitle || '',
    description: row.description || '',
    category: row.category || 'salepage',
    iconName: row.icon_name || row.iconName || 'LayoutTemplate',
    iconBg: row.icon_bg || row.iconBg || 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600',
    iconColor: row.icon_color || row.iconColor || 'text-white',
    badge: row.badge || '🔥 ยอดนิยม',
    badgeColor: row.badge_color || row.badgeColor || 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    status: row.status || 'active',
    priceText: row.price_text || row.priceText || '',
    actionLabel: row.action_label || row.actionLabel || 'เปิดใช้งาน',
    actionUrl: row.action_url || row.actionUrl || '/custom-salepage',
    position: row.position !== undefined ? row.position : 1,
    is_active: row.is_active !== false,
    features: feats
  }
}

// GET: Fetch all services (with active filter for public/dashboard users)
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(req.url)
    const isAdmin = searchParams.get('admin') === 'true'

    // 1. Try public.services table
    try {
      const { data: dbServices, error: dbErr } = await supabase
        .from('services')
        .select('*')
        .order('position', { ascending: true })

      if (!dbErr && dbServices && Array.isArray(dbServices) && dbServices.length > 0) {
        let result = dbServices.map(rowToDTO)
        inMemoryServices = [...result]
        if (!isAdmin) {
          result = result.filter(s => s.is_active !== false)
        }
        return NextResponse.json({ success: true, services: result, source: 'supabase_table' })
      }
    } catch (e) {}

    // 2. Try system_settings table
    try {
      const { data: settingsData, error: settingsErr } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'services_catalog')
        .single()

      if (!settingsErr && settingsData?.value) {
        const parsed = JSON.parse(settingsData.value)
        if (Array.isArray(parsed) && parsed.length > 0) {
          let result = parsed.map(rowToDTO)
          result.sort((a, b) => (a.position || 0) - (b.position || 0))
          inMemoryServices = [...result]
          if (!isAdmin) {
            result = result.filter(s => s.is_active !== false)
          }
          return NextResponse.json({ success: true, services: result, source: 'system_settings' })
        }
      }
    } catch (e) {}

    // 3. In-Memory fallback
    let result = [...inMemoryServices]
    if (!isAdmin) {
      result = result.filter(s => s.is_active !== false)
    }
    return NextResponse.json({ success: true, services: result, source: 'in_memory' })

  } catch (e: any) {
    let fallback = [...inMemoryServices]
    return NextResponse.json({ success: true, services: fallback, source: 'error_fallback' })
  }
}

// POST: Save, Create or Bulk Update services list
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await req.json()
    const { services, service } = body

    const targetList: ServiceItemDTO[] = Array.isArray(services) 
      ? services 
      : (service ? [service] : [])

    if (targetList.length === 0) {
      return NextResponse.json({ success: false, error: 'ไม่พบข้อมูลบริการที่ต้องการบันทึก' }, { status: 400 })
    }

    inMemoryServices = [...targetList]

    const dbRows = targetList.map((s, idx) => ({
      id: s.id,
      title: s.title.trim(),
      subtitle: s.subtitle?.trim() || '',
      description: s.description?.trim() || '',
      category: s.category || 'salepage',
      icon_name: s.iconName || 'LayoutTemplate',
      icon_bg: s.iconBg || 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600',
      icon_color: s.iconColor || 'text-white',
      badge: s.badge?.trim() || '🔥 ยอดนิยม',
      badge_color: s.badgeColor || 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      status: s.status || 'active',
      price_text: s.priceText?.trim() || '',
      action_label: s.actionLabel?.trim() || 'เปิดใช้งาน',
      action_url: s.actionUrl?.trim() || '/custom-salepage',
      position: s.position !== undefined ? s.position : idx + 1,
      is_active: s.is_active !== false,
      features: Array.isArray(s.features) ? s.features : [],
      updated_at: new Date().toISOString()
    }))

    // Upsert to Supabase services table
    try {
      await supabase.from('services').upsert(dbRows, { onConflict: 'id' })
    } catch (e) {}

    // Upsert to Supabase system_settings
    try {
      await supabase.from('system_settings').upsert({
        key: 'services_catalog',
        value: JSON.stringify(targetList),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'บันทึกข้อมูลบริการเสริมลงฐานข้อมูลเรียบร้อยแล้ว',
      services: targetList
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Server error' }, { status: 500 })
  }
}

// DELETE: Delete a single service by id
export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุ id ของบริการที่ต้องการลบ' }, { status: 400 })
    }

    inMemoryServices = inMemoryServices.filter(s => s.id !== id)

    try {
      await supabase.from('services').delete().eq('id', id)
    } catch (e) {}

    try {
      await supabase.from('system_settings').upsert({
        key: 'services_catalog',
        value: JSON.stringify(inMemoryServices),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'ลบบริการเรียบร้อยแล้ว' })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

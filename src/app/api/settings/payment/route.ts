import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { DEFAULT_SITE_SETTINGS } from '../route'

export const dynamic = 'force-dynamic'

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  })
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')

    const config: any = { ...DEFAULT_SITE_SETTINGS }

    if (!error && data && data.length > 0) {
      data.forEach((row: any) => {
        if (row.key && row.value !== null) {
          config[row.key] = row.value
        }
      })
    }

    return NextResponse.json({ success: true, settings: config })
  } catch (e: any) {
    return NextResponse.json({ success: true, settings: DEFAULT_SITE_SETTINGS })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin()
    let body: any = {}
    try {
      body = await request.json()
    } catch {
      body = {}
    }
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 })
    }

    const upsertRows = Object.keys(settings).map((k) => ({
      key: k,
      value: String(settings[k] !== undefined && settings[k] !== null ? settings[k] : '').trim(),
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('system_settings')
      .upsert(upsertRows, { onConflict: 'key' })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also sync admin line settings to admin profiles row if updated
    if (settings.line_channel_access_token || settings.line_user_id || settings.meta_capi_token) {
      try {
        await supabase
          .from('profiles')
          .update({
            line_channel_access_token: settings.line_channel_access_token?.trim() || null,
            line_user_id: settings.line_user_id?.trim() || null,
            line_webhook_url: settings.line_webhook_url?.trim() || null,
            line_notify_token: settings.line_notify_token?.trim() || null,
            meta_capi_token: settings.meta_capi_token?.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('role', 'admin')
      } catch (e) {}
    }

    return NextResponse.json({ 
      success: true, 
      message: 'บันทึกการตั้งค่าราคาแพ็กเกจ แต้มระบบ และบัญชีรับเงินเรียบร้อยแล้ว' 
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const DEFAULT_SETTINGS = {
  promptpay_phone: '0909964514',
  promptpay_bank: 'ธนาคารกสิกรไทย (KBANK)',
  promptpay_account_name: 'วันชนะ ขวัญแก้ว',
  promptpay_account_number: '',
  contact_line_id: '@amth',
  contact_line_url: 'https://line.me/ti/p/@amth',
  payment_instructions: 'สแกน QR Code พร้อมเพย์ด้วยแอปธนาคาร แล้วแนบรูปสลิปเพื่อแจ้งชำระเงิน'
}

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

    if (!error && data && data.length > 0) {
      const config: any = { ...DEFAULT_SETTINGS }
      data.forEach((row: any) => {
        if (row.key && row.value !== null) {
          config[row.key] = row.value
        }
      })
      return NextResponse.json({ success: true, settings: config })
    }

    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS })
  } catch (e: any) {
    return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400 })
    }

    const upsertRows = Object.keys(settings).map((k) => ({
      key: k,
      value: String(settings[k] || '').trim(),
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('system_settings')
      .upsert(upsertRows, { onConflict: 'key' })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'บันทึกการตั้งค่าบัญชีรับเงินสำเร็จ' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 })
  }
}

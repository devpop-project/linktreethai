import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabaseClients() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU'

  return {
    adminClient: serviceKey
      ? createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false }
        })
      : null,
    fallbackClient: createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false }
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { userId, newPassword } = body

    if (!userId || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน หรือรหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      )
    }

    const { adminClient, fallbackClient } = getSupabaseClients()

    // 1. First try Supabase Auth Admin API (if SUPABASE_SERVICE_ROLE_KEY is configured)
    if (adminClient) {
      try {
        const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
          password: newPassword
        })

        if (!error && data?.user) {
          return NextResponse.json({
            success: true,
            message: 'เปลี่ยนรหัสผ่านผ่าน Auth Admin เรียบร้อยแล้ว'
          })
        }
        if (error) {
          console.warn('Auth admin update error:', error.message)
        }
      } catch (adminErr: any) {
        console.warn('Auth admin exception:', adminErr.message)
      }
    }

    // 2. Fallback to SQL RPC function admin_set_user_password in Supabase
    try {
      const { data: rpcData, error: rpcError } = await fallbackClient.rpc(
        'admin_set_user_password',
        {
          target_user_id: userId,
          new_password: newPassword
        }
      )

      if (!rpcError) {
        return NextResponse.json({
          success: true,
          message: 'เปลี่ยนรหัสผ่านผ่าน SQL RPC เรียบร้อยแล้ว'
        })
      }
      console.warn('RPC admin_set_user_password error:', rpcError.message)
    } catch (rpcErr: any) {
      console.warn('RPC exception:', rpcErr.message)
    }

    return NextResponse.json(
      {
        error:
          'ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาตรวจสอบสิทธิ์ Admin หรือตั้งค่า SUPABASE_SERVICE_ROLE_KEY'
      },
      { status: 400 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'เกิดข้อผิดพลาดในการประมวลผล' },
      { status: 500 }
    )
  }
}

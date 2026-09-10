import { NextResponse, type NextRequest } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createClient as createDirectClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    
    // 1. Authenticate caller
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }, { status: 401 })
    }

    // 2. Verify caller has admin role
    const { data: callerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || callerProfile?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'ไม่มีสิทธิ์ผู้ดูแลระบบ (Unauthorized)' }, { status: 403 })
    }

    const body = await request.json()
    const { action } = body

    // ACTION: UPDATE USER PASSWORD
    if (action === 'update_password') {
      const { target_user_id, new_password } = body

      if (!target_user_id) {
        return NextResponse.json({ success: false, message: 'ไม่พบ ID ของผู้ใช้งาน' }, { status: 400 })
      }

      if (!new_password || typeof new_password !== 'string' || new_password.length < 6) {
        return NextResponse.json({ success: false, message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' }, { status: 400 })
      }

      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'

      // Method 1: Using Supabase Admin Service Role Key (if configured)
      if (serviceRoleKey) {
        try {
          const supabaseAdmin = createDirectClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false }
          })
          const { error } = await supabaseAdmin.auth.admin.updateUserById(target_user_id, {
            password: new_password
          })
          if (!error) {
            return NextResponse.json({
              success: true,
              message: 'เปลี่ยนรหัสผ่านของผู้ใช้สำเร็จเรียบร้อยแล้ว'
            })
          }
          console.warn('Service role password update error:', error)
        } catch (adminErr) {
          console.warn('Admin client error:', adminErr)
        }
      }

      // Method 2: Using Postgres RPC admin_update_user_password
      try {
        const { data: rpcResult, error: rpcError } = await supabase.rpc('admin_update_user_password', {
          target_user_id,
          new_password
        })

        if (!rpcError && rpcResult?.success) {
          return NextResponse.json({
            success: true,
            message: rpcResult.message || 'เปลี่ยนรหัสผ่านของผู้ใช้สำเร็จเรียบร้อยแล้ว'
          })
        }
        if (rpcError) {
          console.warn('RPC password update error:', rpcError)
        }
      } catch (rpcErr) {
        console.warn('RPC execution error:', rpcErr)
      }

      // If both methods could not execute because service role key or RPC is missing:
      return NextResponse.json({
        success: false,
        message: 'กรุณารันคำสั่ง SQL สร้างฟังก์ชัน admin_update_user_password ใน Supabase หรือตั้งค่า SUPABASE_SERVICE_ROLE_KEY ใน .env.local เพื่อเปิดใช้งานระบบเปลี่ยนรหัสผ่านโดยตรง'
      }, { status: 500 })
    }

    // ACTION: SEND RESET PASSWORD EMAIL
    if (action === 'send_reset_email') {
      const { email } = body
      if (!email) {
        return NextResponse.json({ success: false, message: 'ไม่พบอีเมลของผู้ใช้' }, { status: 400 })
      }

      const origin = request.headers.get('origin') || 'https://linktreethai.in.th'
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`
      })

      if (error) {
        return NextResponse.json({ success: false, message: `ไม่สามารถส่งอีเมลได้: ${error.message}` }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: `ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยัง ${email} เรียบร้อยแล้ว`
      })
    }

    // ACTION: UPDATE COMPREHENSIVE USER
    if (action === 'update_user') {
      const { target_user_id, profile_updates, new_password, new_email } = body
      if (!target_user_id) {
        return NextResponse.json({ success: false, message: 'ไม่พบ ID ของผู้ใช้' }, { status: 400 })
      }

      // 1. Update Profile in public.profiles
      if (profile_updates && typeof profile_updates === 'object') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            ...profile_updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', target_user_id)

        if (updateError) {
          return NextResponse.json({ success: false, message: `บันทึกข้อมูลไม่สำเร็จ: ${updateError.message}` }, { status: 400 })
        }
      }

      // 2. If new_password provided, update password
      let passwordChanged = false
      if (new_password && typeof new_password === 'string' && new_password.trim().length >= 6) {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dkidksohprjhkcokdbja.supabase.co'

        if (serviceRoleKey) {
          try {
            const supabaseAdmin = createDirectClient(supabaseUrl, serviceRoleKey, {
              auth: { autoRefreshToken: false, persistSession: false }
            })
            const { error: pwdErr } = await supabaseAdmin.auth.admin.updateUserById(target_user_id, {
              password: new_password.trim(),
              ...(new_email ? { email: new_email.trim() } : {})
            })
            if (!pwdErr) passwordChanged = true
          } catch (e) {}
        }

        if (!passwordChanged) {
          try {
            const { data: rpcRes, error: rpcErr } = await supabase.rpc('admin_update_user_password', {
              target_user_id,
              new_password: new_password.trim()
            })
            if (!rpcErr && rpcRes?.success) passwordChanged = true
          } catch (e) {}
        }
      }

      return NextResponse.json({
        success: true,
        message: passwordChanged 
          ? 'อัปเดตข้อมูลผู้ใช้และเปลี่ยนรหัสผ่านใหม่เรียบร้อยแล้ว' 
          : 'อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว'
      })
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    console.error('Admin users API error:', err)
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 })
  }
}

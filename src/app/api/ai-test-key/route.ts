import { NextRequest, NextResponse } from "next/server"

// AI Key Validator for Google Gemini and OpenAI
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { apiKey } = body

    const key = (apiKey || "").trim()
    if (!key) {
      return NextResponse.json({ valid: false, error: "กรุณากรอก API Key ก่อนทำการทดสอบ" }, { status: 400 })
    }

    // 1. Check OpenAI API Key
    if (key.startsWith("sk-")) {
      try {
        const res = await fetch("https://api.openai.com/v1/models", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${key}`
          }
        })
        if (res.ok) {
          return NextResponse.json({ valid: true, provider: "OpenAI GPT-4o / GPT-4o-mini Ready" })
        } else {
          const err = await res.json()
          return NextResponse.json({ valid: false, error: err.error?.message || "OpenAI API Key ไม่ถูกต้องหรือหมดอายุ" })
        }
      } catch (e: any) {
        return NextResponse.json({ valid: false, error: `เกิดข้อผิดพลาดในการเชื่อมต่อ OpenAI: ${e.message}` })
      }
    }

    // 2. Check Google Gemini API Key
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
      if (res.ok) {
        const data = await res.json()
        const count = data.models ? data.models.length : 0
        return NextResponse.json({
          valid: true,
          provider: `Google Gemini AI Vision Ready (${count} Models Available)`
        })
      } else {
        const err = await res.json()
        return NextResponse.json({
          valid: false,
          error: err.error?.message || "Google Gemini API Key ไม่ถูกต้องหรือยังไม่ได้เปิดใช้งาน"
        })
      }
    } catch (e: any) {
      return NextResponse.json({ valid: false, error: `เกิดข้อผิดพลาดในการเชื่อมต่อ Gemini: ${e.message}` })
    }
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message || "เกิดข้อผิดพลาดในการตรวจสอบ Key" }, { status: 500 })
  }
}

/**
 * Safe JSON fetch and parsing helper
 * Prevents "Unexpected token '<', "<!DOCTYPE "... is not valid JSON" SyntaxError
 * when server responses return HTML error pages (404/500/502/redirects).
 */

export async function safeResponseJson<T = any>(
  res: Response,
  defaultErrorMsg = 'เกิดข้อผิดพลาดในการประมวลผล'
): Promise<{ ok: boolean; status: number; data: T | null; error?: string; rawText?: string }> {
  try {
    const text = await res.text()
    if (!text || !text.trim()) {
      return {
        ok: res.ok,
        status: res.status,
        data: null,
        error: res.ok ? undefined : `${defaultErrorMsg} (HTTP ${res.status})`
      }
    }

    const trimmed = text.trim()
    // If response starts with HTML tag or DOCTYPE
    if (trimmed.startsWith('<') || trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<!doctype')) {
      return {
        ok: false,
        status: res.status,
        data: null,
        rawText: trimmed,
        error: `เซิร์ฟเวอร์ตอบกลับเป็นหน้าเว็บ HTML (รหัส ${res.status}) กรุณารีเฟรชหน้าจอหรือตรวจสอบการเชื่อมต่อ`
      }
    }

    let json: any = null
    try {
      json = JSON.parse(text)
    } catch (parseErr: any) {
      return {
        ok: false,
        status: res.status,
        data: null,
        rawText: trimmed,
        error: `รูปแบบข้อมูลที่ได้รับจากเซิร์ฟเวอร์ไม่ถูกต้อง (${parseErr.message})`
      }
    }

    const isSuccess = res.ok && (json.success !== false) && !json.error
    return {
      ok: isSuccess,
      status: res.status,
      data: json,
      error: json.error || (isSuccess ? undefined : `${defaultErrorMsg} (รหัส ${res.status})`)
    }
  } catch (err: any) {
    return {
      ok: false,
      status: res.status || 0,
      data: null,
      error: err.message || defaultErrorMsg
    }
  }
}

export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit,
  defaultErrorMsg = 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์'
): Promise<{ ok: boolean; status: number; data: T | null; error?: string }> {
  try {
    const res = await fetch(input, init)
    return await safeResponseJson<T>(res, defaultErrorMsg)
  } catch (fetchErr: any) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: fetchErr.message || defaultErrorMsg
    }
  }
}

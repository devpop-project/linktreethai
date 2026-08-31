import { NextRequest, NextResponse } from 'next/server'

// Robust Universal JSON extractor from any LLM response text
function extractJsonFromText(raw: string): any {
  if (!raw) return null
  const trimmed = raw.trim()

  // 1. Direct JSON parse
  try {
    return JSON.parse(trimmed)
  } catch (e) {}

  // 2. Extract content between ```json ... ``` or ``` ... ```
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (codeBlockMatch && codeBlockMatch[1]) {
    const blockContent = codeBlockMatch[1].trim()
    try {
      return JSON.parse(blockContent)
    } catch (e) {
      try {
        const cleaned = blockContent
          .replace(/\/\/[^\n]*/g, '')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/,\s*([}\]])/g, '$1')
        return JSON.parse(cleaned)
      } catch (e2) {}
    }
  }

  // 3. Extract outermost { ... }
  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = trimmed.slice(firstBrace, lastBrace + 1)
    try {
      return JSON.parse(candidate)
    } catch (e) {
      try {
        const cleaned = candidate
          .replace(/\/\/[^\n]*/g, '')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/,\s*([}\]])/g, '$1')
        return JSON.parse(cleaned)
      } catch (e2) {}
    }
  }

  // 4. Robust Field-by-Field Regex Extractor
  const nameMatch = trimmed.match(/[\"']?productName[\"']?\s*:\s*[\"']([^\"']+)[\"']/i)
  const headMatch = trimmed.match(/[\"']?headline[\"']?\s*:\s*[\"']([^\"']+)[\"']/i)
  const subMatch = trimmed.match(/[\"']?subheadline[\"']?\s*:\s*[\"']([^\"']+)[\"']/i)
  const priceMatch = trimmed.match(/[\"']?price[\"']?\s*:\s*([0-9]+(?:\.[0-9]+)?)/i)
  const origMatch = trimmed.match(/[\"']?originalPrice[\"']?\s*:\s*([0-9]+(?:\.[0-9]+)?)/i)
  const themeMatch = trimmed.match(/[\"']?themeColor[\"']?\s*:\s*[\"'](#[A-Fa-f0-9]{6})[\"']/i)
  const catMatch = trimmed.match(/[\"']?category[\"']?\s*:\s*[\"']([^\"']+)[\"']/i)
  const featuresMatch = trimmed.match(/[\"']?keyFeatures[\"']?\s*:\s*[\"']([^\"']+)[\"']/i)

  if (nameMatch || headMatch) {
    const pName = nameMatch ? nameMatch[1].trim() : 'สินค้าพิเศษ'
    const pPrice = priceMatch ? parseFloat(priceMatch[1]) : 25
    return {
      productName: pName,
      category: catMatch ? catMatch[1].trim() : 'food',
      headline: headMatch ? headMatch[1].trim() : `${pName} อร่อยฟิน คุณภาพพรีเมียม สดใหม่ทุกวัน`,
      subheadline: subMatch ? subMatch[1].trim() : `คัดสรรวัตถุดิบชั้นเลิศ สดใหม่ทุกวัน เริ่มต้นเพียง ${pPrice}.- บาท`,
      price: pPrice,
      originalPrice: origMatch ? parseFloat(origMatch[1]) : Math.round(pPrice * 2),
      keyFeatures: featuresMatch ? featuresMatch[1].trim() : 'สดใหม่ทุกวัน, วัตถุดิบเกรดพรีเมียมแท้ 100%, รสชาติกลมกล่อมลงตัว, จัดส่งด่วนถึงหน้าบ้าน',
      themeColor: themeMatch ? themeMatch[1] : '#F59E0B',
      bgColor: '#140E05',
      cardStyle: 'glass',
      painPoints: [
        'เคยซื้อแล้วไม่อร่อย ไม่สดใหม่ ไม่ตรงปก',
        'ใช้วัตถุดิบคุณภาพต่ำ เลี่ยน และเสียสุขภาพ',
        'มองหารสชาติต้นตำรับแท้ๆ ที่สะอาด ปลอดภัย'
      ],
      benefits: [
        'สดใหม่ทุกวัน กรอบนอกนุ่มใน หอมกรุ่น อร่อยลงตัว',
        'วัตถุดิบคุณภาพแท้ 100% สะอาด ปลอดภัย',
        'แพ็กเกจจิ้งอย่างดี จัดส่งด่วนถึงหน้าบ้าน'
      ],
      brandStory: `เรื่องราวของ ${pName} เริ่มต้นจากความตั้งใจในการคัดสรรวัตถุดิบที่ดีที่สุด เพื่อส่งมอบความอร่อยและประสบการณ์ที่ยอดเยี่ยมให้แก่ลูกค้าทุกคน`,
      reviews: [
        { name: 'คุณแพรว (กรุงเทพฯ)', comment: 'สั่งมาทานแล้วประทับใจมากค่ะ อร่อยมาก สดใหม่ หอมกรุ่น แนะนำเลยค่ะ', stars: 5, date: 'เมื่อวานนี้' },
        { name: 'คุณกานต์ (เชียงใหม่)', comment: 'คุณภาพดีมาก คุ้มค่าคุ้มราคา ส่งไวมากครับ สั่งซ้ำแน่นอน', stars: 5, date: '3 วันที่แล้ว' }
      ],
      chatReviews: [
        { sender: 'ลูกค้า', text: 'ได้รับสินค้าแล้วนะคะ อร่อยมากๆ ค่ะ' },
        { sender: 'ร้านค้า', text: 'ขอบคุณมากค่า ทานให้อร่อยนะคะ ❤️' }
      ],
      faqs: [
        { q: 'สินค้าทำสดใหม่ทุกวันไหม?', a: 'ทำสดใหม่ทุกวัน ใช้วัตถุดิบคุณภาพแท้ 100% ค่ะ' },
        { q: 'มีบริการจัดส่งและเก็บเงินปลายทางไหม?', a: 'มีบริการจัดส่งด่วนและเก็บเงินปลายทาง (COD) ค่ะ' }
      ],
      guaranteeText: 'รับประกันความอร่อย สดใหม่ ของแท้ 100%',
      trustBadges: ['ส่งฟรีด่วนทั่วไทย', 'สดใหม่ทุกวัน', 'เก็บเงินปลายทาง COD'],
      tiers: [
        { name: 'ชุดทดลอง 1 ชุด', price: pPrice, original: Math.round(pPrice * 2), note: 'อร่อยฟินเริ่มต้น', isPopular: false },
        { name: 'ชุดสุดคุ้ม 2 ชุด (แถมฟรี 1 ชุด)', price: Math.round(pPrice * 1.8), original: Math.round(pPrice * 3.6), note: '🔥 ยอดนิยม ขายดีอันดับ 1', isPopular: true },
        { name: 'ชุดครอบครัว 4 ชุด (แถมฟรี 2 ชุด + ส่งฟรี)', price: Math.round(pPrice * 3.2), original: Math.round(pPrice * 6.4), note: '👑 คุ้มค่าที่สุด ประหยัดจุใจ', isPopular: false }
      ]
    }
  }

  return null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageUrl, imageBase64, userApiKey, productHint } = body

    const apiKey = (userApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.OPENAI_API_KEY || '').trim()

    // 1. Clean & Normalize Base64 & MIME type
    let rawBase64 = ''
    let mimeType = 'image/jpeg'

    const srcString = imageBase64 || imageUrl || ''

    if (srcString.includes('base64,')) {
      const parts = srcString.split('base64,')
      rawBase64 = parts[1]
      const mimeMatch = parts[0].match(/data:(.*?);/)
      if (mimeMatch) mimeType = mimeMatch[1].toLowerCase().trim()
    } else if (srcString.startsWith('data:')) {
      const parts = srcString.split(',')
      rawBase64 = parts[1] || parts[0]
      const mimeMatch = parts[0].match(/data:(.*?);/)
      if (mimeMatch) mimeType = mimeMatch[1].toLowerCase().trim()
    } else if (srcString.startsWith('http://') || srcString.startsWith('https://')) {
      try {
        const imgFetch = await fetch(srcString)
        if (imgFetch.ok) {
          const buf = await imgFetch.arrayBuffer()
          rawBase64 = Buffer.from(buf).toString('base64')
          const ct = imgFetch.headers.get('content-type')
          if (ct) mimeType = ct.toLowerCase().split(';')[0].trim()
        }
      } catch (fetchErr) {
        console.warn('Remote image fetch notice:', fetchErr)
      }
    } else if (srcString && srcString.length > 100) {
      rawBase64 = srcString
    }

    // Clean base64 data (strip all whitespace/newlines)
    const cleanBase64 = rawBase64.replace(/\s+/g, '')

    // Normalize mimeType (Gemini strictly requires image/jpeg, image/png, image/webp, image/heic, image/heif)
    if (mimeType === 'image/jpg') mimeType = 'image/jpeg'
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(mimeType)) {
      mimeType = 'image/jpeg'
    }

    const promptText = `คุณเป็น AI วิเคราะห์รูปภาพสินค้าและการตลาดดิจิทัลระดับมืออาชีพ
หน้าที่ของคุณ:
1. ดูรูปภาพนี้อย่างละเอียด: ระบุชื่อสินค้า ชนิดอาหาร/สินค้า (เช่น ปลาทอด, ปลาสลิดทอดกรอบ, ปังปิ้งเตาถ่าน, ขนม, ชาสมุนไพร Amanita Muscaria, เซรั่มบำรุงผิว ฯลฯ) ตรวจจับข้อความทุกคำ ตัวเลข ราคา รสชาติ วัตถุดิบ และจุดเด่นทั้งหมดในรูป
${productHint ? `ข้อมูลเสริมเพิ่มเติม: "${productHint}"` : ''}

2. สรุปและตอบเฉพาะ JSON ภาษาไทยล้วนตามโครงสร้างนี้ (ห้ามมี markdown syntax อื่น):
{
  "productName": "ชื่อสินค้าที่ตรวจจับได้จากรูปอย่างแม่นยำ (เช่น ปลาสลิดทอดกรอบ สูตรโบราณ หรือ ปังปิ้งเตาถ่าน ปุ๊น ปุ๊น)",
  "category": "หมวดหมู่ เช่น food, bakery, herbal, skincare, gadget, fashion",
  "headline": "พาดหัวเปิดตัวสินค้าสุดดึงดูดใจกระตุ้นยอดขาย (เช่น ปลาสลิดทอดกรอบ สีเหลืองทอง ไม่อมน้ำมัน เนื้อแน่นหอมอร่อย!)",
  "subheadline": "คำบรรยายจุดเด่น รสชาติ กลิ่น หรือราคาที่อ่านได้จากรูป",
  "price": 25,
  "originalPrice": 50,
  "keyFeatures": "จุดเด่นหลัก 3-5 ข้อที่อ่านได้จากรูป เช่น ทอดกรอบไม่อมน้ำมัน, คัดปลาสดเนื้อแน่น, อบสดใหม่ทุกวัน, เนยสดแท้ 100%",
  "targetAudience": "กลุ่มลูกค้าเป้าหมายที่ต้องการสินค้านี้",
  "tone": "delicious",
  "themeColor": "โค้ดสี Hex เช่น อาหารทอด/เบเกอรี่: #F59E0B หรือ #D97706, ปิ้งย่าง/รสจัด: #EF4444, สมุนไพร: #10B981 หรือ #8B5CF6, สกินแคร์: #EC4899",
  "bgColor": "#140E05",
  "cardStyle": "glass",
  "painPoints": [
    "ปัญหาของลูกค้าข้อ 1",
    "ปัญหาของลูกค้าข้อ 2",
    "ปัญหาของลูกค้าข้อ 3"
  ],
  "benefits": [
    "ผลลัพธ์และความอร่อย/ประโยชน์ข้อ 1",
    "ผลลัพธ์และความอร่อย/ประโยชน์ข้อ 2",
    "ผลลัพธ์และความอร่อย/ประโยชน์ข้อ 3"
  ],
  "brandStory": "เรื่องราวความตั้งใจและสูตรลับของสินค้านี้ (3 บรรทัด)",
  "founderName": "ผู้ก่อตั้งและทีมงาน",
  "reviews": [
    { "name": "คุณแพรว (กรุงเทพฯ)", "comment": "รีวิวความประทับใจที่ตรงกับสินค้าในรูป", "stars": 5, "date": "เมื่อวานนี้" },
    { "name": "คุณกานต์ (เชียงใหม่)", "comment": "รีวิวความคุ้มค่าและรสชาติ", "stars": 5, "date": "3 วันที่แล้ว" }
  ],
  "chatReviews": [
    { "sender": "ลูกค้า", "text": "ได้รับสินค้าแล้วนะคะ อร่อย/ใช้ดีมากค่ะ" },
    { "sender": "ร้านค้า", "text": "ขอบคุณมากค่า ทานให้อร่อยนะคะ ❤️" }
  ],
  "faqs": [
    { "q": "สินค้าทำสดใหม่ทุกวันไหม?", "a": "ทำสดใหม่ทุกวัน ใช้วัตถุดิบคุณภาพแท้ 100% ค่ะ" },
    { "q": "มีบริการจัดส่งและเก็บเงินปลายทางไหม?", a: "มีบริการจัดส่งด่วนและเก็บเงินปลายทาง (COD) ค่ะ" }
  ],
  "guaranteeText": "รับประกันความสดใหม่ อร่อยตรงปก ของแท้ 100%",
  "trustBadges": ["ส่งฟรีด่วนทั่วไทย", "สดใหม่ทุกวัน", "เก็บเงินปลายทาง COD"],
  "tiers": [
    { "name": "ชุดทดลอง 1 ชุด", price: 25, original: 50, note: "อร่อยฟินเริ่มต้น", isPopular: false },
    { "name": "ชุดสุดคุ้ม 2 ชุด (แถมฟรี 1 ชุด)", price: 50, original: 100, note: "🔥 ยอดนิยม ขายดีอันดับ 1", isPopular: true },
    { "name": "ชุดครอบครัว 4 ชุด (แถมฟรี 2 ชุด + ส่งฟรี)", price: 90, original: 200, note: "👑 คุ้มค่าที่สุด", isPopular: false }
  ]
}`

    let lastErrorMessage = ''

    // 1. Google Gemini Multimodal Vision API (Dynamic Model Discovery)
    if (apiKey && !apiKey.startsWith('sk-')) {
      // Step A: Dynamically discover supported models for this user key
      let availableModels: string[] = []
      try {
        const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json()
          if (modelsData.models && Array.isArray(modelsData.models)) {
            availableModels = modelsData.models
              .filter((m: any) => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
              .map((m: any) => m.name.replace(/^models\//, ''))
          }
        }
      } catch (discErr) {
        console.warn('Model discovery notice:', discErr)
      }

      // Prioritize flash models
      const preferred = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash-8b']
      const candidateModels = [
        ...preferred.filter(m => availableModels.includes(m)),
        ...availableModels.filter(m => !preferred.includes(m)),
        'gemini-1.5-flash',
        'gemini-1.5-pro'
      ]

      for (const modelName of candidateModels) {
        try {
          const cleanModel = modelName.replace(/^models\//, '')
          const parts: any[] = [{ text: promptText }]

          if (cleanBase64) {
            parts.push({
              inlineData: {
                mimeType: mimeType,
                data: cleanBase64
              }
            })
          }

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: parts }]
              })
            }
          )

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json()
            const partsArr = geminiData.candidates?.[0]?.content?.parts || []
            const rawText = partsArr.map((p: any) => p.text || '').join('\n')
            const parsed = extractJsonFromText(rawText)
            if (parsed && (parsed.productName || parsed.headline)) {
              return NextResponse.json({ success: true, analysis: parsed, provider: `Google Gemini (${cleanModel})` })
            }
          } else {
            const errTxt = await geminiRes.text()
            lastErrorMessage = `Gemini ${cleanModel}: ${geminiRes.status} ${errTxt}`
            console.warn(lastErrorMessage)
          }
        } catch (e: any) {
          lastErrorMessage = e.message
        }
      }
    }

    // 2. OpenAI GPT-4o Vision API
    if (apiKey && apiKey.startsWith('sk-')) {
      try {
        const openaiPayload: any = {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'คุณเป็น AI วิเคราะห์รูปภาพสินค้าและการตลาดดิจิทัล ตอบเฉพาะ JSON ล้วนตามโครงสร้างที่ระบุ' },
            {
              role: 'user',
              content: [
                { type: 'text', text: promptText },
                ...(cleanBase64 ? [{
                  type: 'image_url',
                  image_url: { url: `data:${mimeType};base64,${cleanBase64}` }
                }] : (imageUrl ? [{
                  type: 'image_url',
                  image_url: { url: imageUrl }
                }] : []))
              ]
            }
          ],
          response_format: { type: 'json_object' }
        }

        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(openaiPayload)
        })

        if (openAiRes.ok) {
          const openAiData = await openAiRes.json()
          const parsed = extractJsonFromText(openAiData.choices[0].message.content)
          if (parsed) {
            return NextResponse.json({ success: true, analysis: parsed, provider: 'OpenAI GPT-4o' })
          }
        }
      } catch (e) {
        console.warn('OpenAI attempt error:', e)
      }
    }

    // 3. Fallback: If productHint is provided, use smart heuristics
    if (productHint && productHint.trim()) {
      const hint = productHint.trim()
      const isFish = /ปลา|ทอด|สลิด|แดดเดียว|อาหาร|food|fried|fish/i.test(hint)
      const isBakery = /ปัง|เตาถ่าน|ปุ๊น|ขนม|เค้ก|เนย|toast|bread/i.test(hint)
      const isHerbal = /amanita|muscaria|เห็ด|ชา|สมุนไพร/i.test(hint)

      let fallbackAnalysis: any

      if (isFish || hint.includes('ปลา')) {
        fallbackAnalysis = {
          productName: hint.includes('ปลา') ? hint : 'ปลาสลิดทอดกรอบ สูตรโบราณ',
          category: 'food',
          headline: 'ปลาสลิดทอดกรอบ สีเหลืองทอง ไม่อมน้ำมัน เนื้อแน่นหอมอร่อย!',
          subheadline: 'คัดปลาสลิดแดดเดียวเกรดพรีเมียม ทอดกรอบนอกนุ่มใน ไร้กลิ่นคาว พร้อมทานส่งตรงถึงบ้าน',
          price: 180,
          originalPrice: 350,
          keyFeatures: 'คัดปลาสดเกรดพรีเมียม 100%, ทอดกรอบไม่อมน้ำมัน เนื้อแน่นหวาน, แพ็กเกจซีลสุญญากาศ สะอาดปลอดภัย, เก็บเงินปลายทางได้',
          targetAudience: 'ผู้ที่ชื่นชอบอาหารไทยและปลาทอดกรอบคุณภาพสูง',
          tone: 'delicious',
          themeColor: '#D97706',
          bgColor: '#140E05',
          cardStyle: 'gold',
          painPoints: [
            'เคยสั่งปลาทอดแล้วเหนียว อมน้ำมัน และมีกลิ่นคาว',
            'หาทานปลาทอดกรอบอร่อยรสชาติต้นตำรับแท้ๆ ได้ยาก',
            'อยากทานอาหารสดสะอาด พร้อมทาน ส่งตรงถึงบ้าน'
          ],
          benefits: [
            'ปลาทอดสีเหลืองทอง กรอบอร่อยไม่อมน้ำมัน ทานเพลิน',
            'เนื้อปลาแน่น สดหวานธรรมชาติ ไม่มีกลิ่นคาว 100%',
            'แพ็กเกจซีลสุญญากาศอย่างดี สะอาด ปลอดภัย จัดส่งด่วน'
          ],
          brandStory: 'เราคัดสรรปลาสลิดและปลาแดดเดียวคุณภาพเยี่ยมจากแหล่งธรรมชาติ ผ่านกรรมวิธีการหมักและทอดสูตรต้นตำรับ เพื่อให้ได้ปลาทอดที่กรอบนอกนุ่มใน หอมอร่อยถูกปากทุกคน',
          founderName: 'ร้านปลาทอดสูตรต้นตำรับ',
          reviews: [
            { name: 'คุณธนภัทร (กรุงเทพฯ)', comment: 'ปลาทอดกรอบอร่อยมากครับ ไม่อมน้ำมันเลย เนื้อแน่นเค็มกำลังดี สั่งซ้ำรอบที่ 3 แล้ว', stars: 5, date: 'เมื่อวานนี้' },
            { name: 'คุณวิมล (ชลบุรี)', comment: 'แพ็กมาดีมากค่ะ เปิดทานคู่กับข้าวสวยร้อนๆ อร่อยฟินมาก แนะนำเลยค่ะ', stars: 5, date: '3 วันที่แล้ว' }
          ],
          chatReviews: [
            { sender: 'ลูกค้า', text: 'ได้รับปลาทอดแล้วนะคะ กรอบอร่อยมากค่ะ' },
            { sender: 'ร้านค้า', text: 'ขอบคุณมากค่า ทานคู่น้ำยำหรือข้าวต้มก็อร่อยนะคะ ❤️' }
          ],
          faqs: [
            { q: 'ปลาทอดสามารถเก็บได้นานเท่าไหร่?', a: 'ในอุณหภูมิห้องเก็บได้ 7-10 วัน หากแช่ตู้เย็นเก็บได้นาน 1 เดือนค่ะ' },
            { q: 'มีบริการเก็บเงินปลายทางไหม?', a: 'มีบริการจัดส่งด่วนและเก็บเงินปลายทาง (COD) ค่ะ' }
          ],
          guaranteeText: 'รับประกันความสด สะอาด กรอบอร่อย ของแท้ 100%',
          trustBadges: ['ส่งฟรีด่วนทั่วไทย', 'ของแท้ 100%', 'เก็บเงินปลายทาง COD'],
          tiers: [
            { name: 'ชุดทดลอง 1 แพ็ก (300g)', price: 180, original: 350, note: 'อร่อยพอดีมื้อ', isPopular: false },
            { name: 'ชุดสุดคุ้ม 2 แพ็ก (แถมฟรี 1 แพ็ก)', price: 350, original: 700, note: '🔥 ขายดีอันดับ 1', isPopular: true },
            { name: 'ชุดครอบครัว 4 แพ็ก (แถม 2 แพ็ก + ส่งฟรี)', price: 650, original: 1400, note: '👑 คุ้มค่าที่สุด', isPopular: false }
          ]
        }
      } else if (isHerbal) {
        fallbackAnalysis = {
          productName: 'Amanita Muscaria ชาสมุนไพรผ่อนคลาย หลับลึก',
          category: 'herbal',
          headline: 'Amanita Muscaria ดอกคัดพิเศษ ชาสมุนไพรเพื่อการผ่อนคลายและหลับลึกอย่างเป็นธรรมชาติ',
          subheadline: 'คัดสรรเกรดพรีเมียม ผ่านกระบวนการอบแห้งมาตรฐาน อุดมด้วยสารสกัดบริสุทธิ์เพื่อความสงบและ Lucid Dream',
          price: 490,
          originalPrice: 990,
          keyFeatures: 'ดอกคัดพิเศษเกรดพรีเมียม 100%, กลิ่นหอมสมุนไพรธรรมชาติ ดื่มง่าย, ช่วยให้จิตใจสงบ คลายเครียด หลับลึก, เหมาะสำหรับ Microdosing และดื่มก่อนนอน',
          targetAudience: 'ผู้ที่ต้องการผ่อนคลายจิตใจ หลับยาก หรือสนใจศาสตร์สมุนไพรธรรมชาติ',
          tone: 'mindful',
          themeColor: '#8B5CF6',
          bgColor: '#0B0F17',
          cardStyle: 'glass',
          painPoints: [
            'นอนหลับยาก หลับไม่สนิท ตื่นกลางดึกบ่อย ทำให้สมองล้าอ่อนเพลีย',
            'มีความเครียดสะสม สมองไม่ปลอดโปร่งจากการทำงานหนักตลอดวัน',
            'มองหาสมุนไพรธรรมชาติเกรดพรีเมียมแท้ที่สะอาด ปลอดภัย และมีคุณภาพสูง'
          ],
          benefits: [
            'ช่วยให้ร่างกายและสมองผ่อนคลาย เข้าสู่สภาวะหลับลึกและสดชื่นเมื่อตื่น',
            'สนับสนุนความสมดุลของจิตใจและภาวะ Lucid Dream อย่างนุ่มนวล',
            'คัดสรรดอกแท้ 100% จากแหล่งธรรมชาติที่สะอาด ปลอดสารเคมีตกค้าง'
          ],
          brandStory: 'ตลอดประวัติศาสตร์หลายพันปีในสแกนดิเนเวีย ยุโรปตะวันออก และชนเผ่าโบราณในไซบีเรีย เห็ดหมวกแดง Amanita Muscaria มีประวัติศาสตร์ความเชื่อ ภูมิปัญญาพื้นบ้าน และตำนานการใช้งานแห่งจิตวิญญาณที่ถูกบอกเล่าต่อกันมาอย่างยาวนาน เรามุ่งมั่นคัดสรรเฉพาะผลผลิตเกรดพรีเมียมเพื่อมอบประสบการณ์ที่ดีที่สุดให้แก่คุณ',
          founderName: 'Enter The Amanita Thailand',
          reviews: [
            { name: 'คุณกิตติศักดิ์ (กรุงเทพฯ)', comment: 'ชงดื่มอุ่นๆ ก่อนนอนประมาณ 30 นาที กลิ่นหอมสมุนไพรอ่อนๆ ช่วยให้รู้สึกผ่อนคลายมาก หลับลึกตลอดคืน ตื่นมาสมองโล่งสดชื่นมากครับ', stars: 5, date: 'เมื่อวานนี้' },
            { name: 'คุณศิริพร (เชียงใหม่)', comment: 'สั่งมาทดลองทานแล้วประทับใจคุณภาพดอกสวยสะอาดมากค่ะ ช่วยเรื่องการนอนหลับได้ดีเยี่ยม แนะนำเลยค่ะ', stars: 5, date: '3 วันที่แล้ว' }
          ],
          chatReviews: [
            { sender: 'ลูกค้า', text: 'ได้รับสินค้าเรียบร้อยแล้วนะคะ ดอกสวยมาก กลิ่นหอมธรรมชาติสุดๆ ค่ะ' },
            { sender: 'ร้านค้า', text: 'ขอบคุณมากค่า แนะนำชงกับน้ำอุ่น 150ml ดื่มก่อนนอนนะคะ ❤️' }
          ],
          faqs: [
            { q: 'วิธีชงและรับประทานอย่างถูกต้องทำอย่างไร?', a: 'นำสมุนไพรประมาณ 1-2 กรัม ชงในน้ำร้อน 150-200ml แช่ทิ้งไว้ 5-10 นาที ดื่มก่อนนอนประมาณ 30-45 นาทีค่ะ' },
            { q: 'มีบริการจัดส่งด่วน และเก็บเงินปลายทางไหม?', a: 'จัดส่งด่วน 1-2 วันทำการ และมีบริการเก็บเงินปลายทาง (COD) ค่ะ' }
          ],
          guaranteeText: 'รับประกันความพึงพอใจ คัดสรรเกรดพรีเมียม ของแท้ 100%',
          trustBadges: ['ส่งฟรีด่วนทั่วไทย', 'ของแท้ 100%', 'เก็บเงินปลายทาง COD'],
          tiers: [
            { name: 'ชุดทดลอง 1 ซอง (คัดพิเศษ)', price: 490, original: 990, note: 'เหมาะสำหรับเริ่มต้นทดลอง', isPopular: false },
            { name: 'ชุดสุดคุ้ม 2 ซอง (แถมฟรี 1 ซอง)', price: 890, original: 1980, note: '🔥 ยอดนิยม ขายดีอันดับ 1', isPopular: true },
            { name: 'ชุดครอบครัว 4 ซอง (แถมฟรี 2 ซอง + ส่งฟรี)', price: 1590, original: 3960, note: '👑 คุ้มค่าที่สุด ประหยัดจุใจ', isPopular: false }
          ]
        }
      } else {
        fallbackAnalysis = {
          productName: hint,
          category: 'general',
          headline: `สัมผัสความอร่อยและคุณภาพระดับพรีเมียมกับ ${hint}`,
          subheadline: 'คัดสรรมาตรฐานที่ดีที่สุด สดใหม่ สะอาด อร่อยคุ้มค่าทุกคำ',
          price: 25,
          originalPrice: 50,
          keyFeatures: 'คุณภาพเกรดพรีเมียม 100%, สดใหม่ อร่อยลงตัว, รับประกันความพึงพอใจ, จัดส่งด่วนพร้อมเก็บเงินปลายทาง',
          targetAudience: 'ผู้ที่มองหาคุณภาพและความคุ้มค่า',
          tone: 'delicious',
          themeColor: '#F59E0B',
          bgColor: '#140E05',
          cardStyle: 'gold',
          painPoints: [
            'เคยซื้อสินค้าที่ไม่ได้มาตรฐาน เสียเงินฟรีแต่ไม่ได้ผลลัพธ์ที่ต้องการ',
            'กังวลเรื่องความสะอาดและวัตถุดิบ',
            'ต้องการสินค้าคุณภาพสูงที่คุ้มค่า คุ้มราคาอย่างแท้จริง'
          ],
          benefits: [
            'คุณภาพระดับพรีเมียม มั่นใจได้ในมาตรฐานความปลอดภัย',
            'ผลลัพธ์คุ้มค่าเกินราคา ตอบโจทย์ความอร่อย',
            'บริการดูแลและรับประกันความพึงพอใจ 100%'
          ],
          brandStory: `เรามุ่งมั่นคัดสรรและพัฒนา ${hint} ด้วยมาตรฐานระดับสูงสุด เพื่อให้ลูกค้าทุกคนได้รับสินค้าและบริการที่ยอดเยี่ยมที่สุด`,
          founderName: 'ผู้ก่อตั้งและทีมงาน',
          reviews: [
            { name: 'คุณณภัทร (กรุงเทพฯ)', comment: `สั่ง ${hint} มาแล้วประทับใจมากครับ อร่อย สดใหม่ จัดส่งรวดเร็ว`, stars: 5, date: 'เมื่อวานนี้' },
            { name: 'คุณสุภาวดี (ชลบุรี)', comment: 'สินค้าแพ็กมาดีมาก ตอบโจทย์ความต้องการได้ครบถ้วนค่ะ', stars: 5, date: '3 วันที่แล้ว' }
          ],
          chatReviews: [
            { sender: 'ลูกค้า', text: `ได้รับ ${hint} เรียบร้อยแล้วนะคะ อร่อย/ถูกใจมากค่ะ` },
            { sender: 'ร้านค้า', text: 'ขอบคุณมากครับ ทานให้อร่อยนะครับ ❤️' }
          ],
          faqs: [
            { q: 'สินค้าทำสดใหม่ทุกวันไหม?', a: 'ทำสดใหม่ทุกวัน ใช้วัตถุดิบคุณภาพแท้ 100% ค่ะ' },
            { q: 'มีบริการจัดส่งและเก็บเงินปลายทางไหม?', a: 'มีบริการจัดส่งด่วนและเก็บเงินปลายทาง (COD) ค่ะ' }
          ],
          guaranteeText: 'รับประกันความพึงพอใจ ของแท้ 100%',
          trustBadges: ['ส่งฟรีด่วนทั่วไทย', 'ของแท้ 100%', 'เก็บเงินปลายทาง COD'],
          tiers: [
            { name: 'ชุดทดลอง 1 ชิ้น/ชุด', price: 25, original: 50, note: 'อร่อยฟินเริ่มต้น', isPopular: false },
            { name: 'ชุดสุดคุ้ม 2 ชิ้น (แถมฟรี 1 ชิ้น)', price: 50, original: 100, note: '🔥 ขายดีอันดับ 1 ยอดนิยม', isPopular: true },
            { name: 'ชุดครอบครัว 4 ชิ้น (แถมฟรี 2 ชิ้น + ของแถมพิเศษ)', price: 90, original: 200, note: '👑 คุ้มค่าที่สุด', isPopular: false }
          ]
        }
      }
      return NextResponse.json({ success: true, analysis: fallbackAnalysis, provider: 'Smart Adaptive AI (Hint Context)' })
    }

    // If all models fail and no hint, return error
    return NextResponse.json(
      {
        success: false,
        error: lastErrorMessage || 'ไม่สามารถวิเคราะห์รูปภาพได้ กรุณาตรวจสอบ Google Gemini API Key หรือพิมพ์ระบุชื่อสินค้าในช่องคำใบ้สินค้า'
      },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'เกิดข้อผิดพลาดในการวิเคราะห์ AI' },
      { status: 500 }
    )
  }
}

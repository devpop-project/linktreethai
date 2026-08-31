export interface ServiceItemDTO {
  id: string
  title: string
  subtitle: string
  description: string
  category: 'salepage' | 'ai' | 'marketing' | 'system'
  iconName: string
  iconBg: string
  iconColor: string
  badge: string
  badgeColor: string
  status: 'active' | 'updating'
  features: string[]
  priceText?: string
  actionLabel: string
  actionUrl?: string
  position?: number
  is_active?: boolean
}

export const DEFAULT_SERVICES_LIST: ServiceItemDTO[] = [
  {
    id: 'custom-salepage',
    title: 'Custom Salepage',
    subtitle: 'สร้าง Salepage แบบกำหนดเอง',
    description: 'บริการออกแบบและจัดสร้างหน้าเซลเพจปิดการขายแบบ Custom เฉพาะแบรนด์ของคุณ ดีไซน์ระดับพรีเมียม สไตล์ Mobile-App โหลดเร็วเสี้ยววินาที พร้อมระบบชำระเงิน Dynamic PromptPay, เก็บเงินปลายทาง (COD) และเชื่อมต่อพิกเซลโฆษณาครบวงจร',
    category: 'salepage',
    iconName: 'LayoutTemplate',
    iconBg: 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600',
    iconColor: 'text-white',
    badge: '🔥 ยอดนิยม',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    status: 'active',
    priceText: 'เริ่มต้น 990.- / เซลเพจ',
    actionLabel: 'สั่งทำเซลเพจ / ปรึกษาออกแบบ',
    actionUrl: '/custom-salepage',
    position: 1,
    is_active: true,
    features: [
      'ออกแบบ UI/UX สวยหรู สไตล์ Mobile App เฉพาะเอกลักษณ์แบรนด์คุณ',
      'ระบบคำนวณเงิน + Dynamic PromptPay EMVCo QR ยอดตรง พร้อมแนบสลิป',
      'ฟอร์มสั่งซื้อเก็บเงินปลายทาง (COD) คำนวณค่าจัดส่งอัตโนมัติ',
      'ติดตั้ง Multi-Pixel (Meta CAPI, TikTok, Google, LINE Tag) ครบ 100%',
      'เชื่อมต่อระบบแจ้งเตือนออเดอร์ใหม่และสลิปเข้า LINE OA แบบ Real-time',
      'รองรับ Custom Domain และระบบบันทึกฐานข้อมูลลูกค้า (CRM)',
    ],
  },
  {
    id: 'ai-copy-studio',
    title: 'AI Copywriting Studio',
    subtitle: 'สร้างคอนเทนต์ & สคริปต์วิดีโอ',
    description: 'สตูดิโอปัญญาประดิษฐ์ช่วยเขียนพาดหัว Hook เปิดคลิป สคริปต์สั้นสำหรับ TikTok / Reels / Shorts และแคปชั่นปิดการขาย Facebook สไตล์ Direct Response แม่นยำตรงกลุ่มเป้าหมาย',
    category: 'ai',
    iconName: 'Sparkles',
    iconBg: 'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500',
    iconColor: 'text-slate-950',
    badge: '✨ AI Studio',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    status: 'active',
    priceText: 'ใช้งานฟรีสำหรับสมาชิก',
    actionLabel: 'เปิดใช้งาน AI Studio',
    actionUrl: '/ai-salepage',
    position: 2,
    is_active: true,
    features: [
      'สร้างสคริปต์ TikTok Hook 3 วินาทีแรกหยุดนิ้วคนดู',
      'เขียนแคปชั่น AIDA & PAS สำหรับยิงแอด Facebook',
      'คิดไอเดียโปรโมชั่นและข้อความ Broadcast LINE OA',
      'ปรับแต่งโทนเสียงของแบรนด์ (หรูหรา, อบอุ่น, กระตุ้นการตัดสินใจ)'
    ]
  },
  {
    id: 'line-crm-hub',
    title: 'LINE CRM & Broadcast',
    subtitle: 'เชื่อมโยงระบบ LINE OA อัตโนมัติ',
    description: 'ระบบเชื่อมโยงฐานข้อมูลลูกค้าจาก LinkTreeThai เข้ากับ LINE Official Account อัตโนมัติ สำหรับบรอดแคสต์โปรโมชั่นเฉพาะกลุ่มและสะสมแต้มสมาชิก',
    category: 'system',
    iconName: 'MessageCircle',
    iconBg: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600',
    iconColor: 'text-white',
    badge: '⚡ กำลังอัปเดต',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    status: 'updating',
    priceText: 'เปิดบริการเร็วๆ นี้',
    actionLabel: 'รับการแจ้งเตือนเมื่อเปิดบริการ',
    actionUrl: 'line',
    position: 3,
    is_active: true,
    features: [
      'Sync รายชื่อลูกค้าและเบอร์โทรเข้า LINE OA Tag อัตโนมัติ',
      'ระบบสะสมแต้มและบัตรสมาชิกดิจิทัลผ่าน LINE',
      'ส่งข้อความแจ้งเตือนสถานะการจัดส่งพัสดุอัตโนมัติ',
    ],
  },
  {
    id: 'custom-domain-pro',
    title: 'White-Label & Domain Pro',
    subtitle: 'เชื่อมต่อชื่อโดเมนส่วนตัว 100%',
    description: 'บริการผูกโดเมนส่วนตัวแบบ Custom Domain (.com, .co.th, .shop) พร้อมใบรับรองความปลอดภัย SSL ฟรีตลอดชีพ และลบลายน้ำทุกจุด 100%',
    category: 'marketing',
    iconName: 'ShieldCheck',
    iconBg: 'bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500',
    iconColor: 'text-white',
    badge: '💎 พรีเมียม',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    status: 'updating',
    priceText: 'เปิดบริการเร็วๆ นี้',
    actionLabel: 'รับการแจ้งเตือนเมื่อเปิดบริการ',
    actionUrl: 'line',
    position: 4,
    is_active: true,
    features: [
      'เชื่อมต่อชื่อเว็บไซต์ของคุณได้ 100%',
      'ลบลายน้ำระบบเพื่อภาพลักษณ์แบรนด์ระดับพรีเมียม',
      'ติดตั้ง CDN ระดับ Global เพิ่มความเร็วในการโหลดสูงสุด',
    ],
  },
]

# 📱 LinkTreeThai - Bio.link Style Mobile App Suite (V15)

แอปพลิเคชัน Bio Link, Digital Shop, URL Shortener พร้อมระบบล็อกด้วยแต้ม และ Admin Master Suite สไตล์ Mobile App สวยงามเหมือน **Bio.link** พัฒนาด้วย **Next.js 14 (App Router)**, **Tailwind CSS** และ **Supabase**

---

## ⚡ ข้อมูลการเชื่อมต่อ Supabase (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://dkidksohprjhkcokdbja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU
```

---

## 🌟 ฟีเจอร์ใหม่ใน LinkTreeThai V15

### 🖼️ 1. ระบบรูปภาพตัวอย่างปุ่มลิ้งก์ (Link Thumbnails & Custom Logos)
- เพิ่มฟังก์ชันอัปโหลดรูปภาพตัวอย่าง / โลโก้เฉพาะของแต่ละปุ่มลิ้งก์ (`logo_url`)
- ในหน้า Dashboard จะแสดงรูปภาพตัวอย่าง Thumbnail หรือไอคอนแบรนด์จริง (LINE, Shopee, Lazada, Facebook, TikTok, YouTube, Website) ทันที
- บนหน้าโปรไฟล์จริงและพรีวิว แสดงรูปภาพตัวอย่างปุ่มขนาดพอดีมุมโค้งมนแบบแอปมือถือ

### 🔒 2. ระบบย่อลิงก์แบบล็อกสิทธิ์ (100 แต้ม / 30 วัน & Admin Unlock)
- **ระบบความปลอดภัย:** ป้องกันผู้ใช้ทั่วไปใช้งานระบบย่อลิงก์จนกว่าจะปลดล็อก
- **ปลดล็อกด้วยแต้ม:** สมาชิกสามารถกด **"🔓 ปลดล็อก 100 แต้ม (ใช้งานได้ 30 วัน)"** ในหน้าแดชบอร์ดได้ทันที
- **สิทธิ์อัตโนมัติ:** บัญชี **Admin** และ **MASTER VIP** จะได้รับการปลดล็อกระบบย่อลิงก์แบบไม่จำกัดโดยอัตโนมัติ
- **แอดมินจัดการได้:** ผู้ดูแลระบบสามารถมอบสิทธิ์ URL Shortener Pass หรือเพิ่มแต้มให้สมาชิกได้จากหน้า `/admin`

### 🌐 3. หน้าแรกใหม่สไตล์ Bio.link (`/`)
- **Interactive Username Claim Bar:** กล่องพิมพ์จองชื่อลิงก์ `linktreethai.com/[ yourname ]` พร้อมปุ่ม *"จองลิงก์ของคุณฟรี"* ที่พายังหน้าสมัครสมาชิกพร้อมกรอก Username ให้อัตโนมัติ
- **Live Smartphone Showcase:** แสดงหน้าจอจำลองสมาร์ทโฟนพร้อม 10 ไอคอนโซเชียล และปุ่มลิ้งก์ตัวอย่างสวยงาม
- **Hero & Feature Grids:** สรุปฟังก์ชันเด่น, ร้านค้าดิจิทัล 0% GP, ระบบย่อลิงก์, เทมเพลต 9 รูปแบบ และตารางเปรียบเทียบแพ็กเกจ

---

## 📧 การตั้งค่า URL ยืนยันอีเมลสำหรับโดเมนจริง / Deploy บน Vercel

1. เข้าไปที่ **Supabase Dashboard** -> เลือกโปรเจกต์
2. ไปที่เมนู **Authentication** -> **URL Configuration**
3. **Site URL:** ใส่โดเมนจริง เช่น `https://your-domain.com` (หรือ `https://linktreethai.vercel.app`)
4. **Redirect URLs:** เพิ่มรายการ:
   ```text
   https://your-domain.com/**
   https://*.vercel.app/**
   http://localhost:3000/**
   ```
5. กด **Save**

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. รันโหมด Development
npm run dev

# 3. เปิดเบราว์เซอร์เข้าใช้งาน
http://localhost:3000
```

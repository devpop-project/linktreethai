# 🚀 Linktree Pro Suite V12 + Complete Admin CRUD + URL Shortener

ระบบ Bio Link, ร้านค้าดิจิทัล (Digital Shop), ระบบจัดการหลังบ้านผู้ดูแลระบบแบบเต็มรูปแบบ (Full Admin CRUD) และระบบย่อลิงก์ (URL Shortener) พัฒนาด้วย **Next.js 14 (App Router)** และ **Supabase Database & Authentication**

---

## ⚡ ข้อมูลการเชื่อมต่อ Supabase ใหม่ (Config)
```env
NEXT_PUBLIC_SUPABASE_URL=https://dkidksohprjhkcokdbja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_rV42rP4GC0GQaI7eK56X9Q_ADKY96PU
```

---

## 🌟 ฟีเจอร์ใหม่ที่ได้รับการอัปเกรด

### 1. 🛡️ ระบบหลังบ้านผู้ดูแลระบบ (Complete Admin CRUD Panel `/admin`)
- **👥 จัดการสมาชิก (Users CRUD)**:
  - เพิ่มผู้ใช้งานใหม่โดยตรงจากหลังบ้าน (Create User)
  - ค้นหา กรองตามบทบาท (Role) หรือระดับสมาชิก (Free / Pro / Master)
  - ปรับปรุง/แก้ไขโปรไฟล์ผู้ใช้ทุกฟิลด์ (Username, Name, Bio, Avatar, Cover, Role, Template, Hide Branding)
  - เติมแต้ม / หักแต้มสะสมแบบระบุจำนวนเอง
  - มอบสิทธิ์ VIP (Pro Member / Master VIP) พร้อมกำหนดจำนวนวันใช้งาน (30 วัน, 90 วัน, 1 ปี หรือกำหนดเอง)
  - ลบสมาชิกและล้างข้อมูลที่เกี่ยวข้องแบบถาวร (Delete User with Cascade)
- **🔗 จัดการลิ้งก์ทั้งหมด (Links CRUD)**:
  - เพิ่มลิ้งก์ใหม่ให้ผู้ใช้คนใดก็ได้ในระบบ
  - ดูรายการลิ้งก์ทั้งหมด กรองตามเจ้าของ ค้นหาตามชื่อ/URL
  - แก้ไขข้อความปุ่ม คำอธิบายย่อย URL ไอคอน สีพื้นหลัง ยอดคลิก และสถานะเปิด/ปิด
  - ลบลิ้งก์ที่ไม่เหมาะสม
- **🛍️ จัดการสินค้าทั้งหมด (Products CRUD)**:
  - เพิ่มสินค้าใหม่เข้าร้านค้าของผู้ใช้
  - ดู แก้ไขภาพปก ราคา หมวดหมู่ ลิงก์สั่งซื้อ ป้าย Badge และสถานะวางขาย
  - ลบสินค้า
- **📋 ข้อมูลผู้ติดต่อ & ลูกค้าเป้าหมาย (Leads CRM)**:
  - ตรวจสอบรายชื่อลูกค้าที่ติดต่อเข้ามาผ่านหน้า Bio Link
  - ส่งออกข้อมูลเป็นไฟล์ CSV (Export to CSV)
  - ลบข้อมูล Lead
- **⚙️ ข้อมูลระบบ & คำสั่ง SQL Helper**:
  - แสดงสถานะการเชื่อมต่อ และคำสั่ง SQL สำหรับตั้งค่า User ให้เป็น Admin

---

### 2. ✂️ ระบบย่อลิงก์ (URL Shortener `/s/[slug]`)
- **แปลง URL ขนาดยาวเป็น URL สั้นตามใจชอบ**:
  - นำลิงก์จาก Facebook, Shopee, Line, YouTube หรือเว็บใดๆ มาวาง
  - ตั้งรหัสย่อ (Slug) ที่ต้องการ เช่น `promo`, `fb-amanita`, `line-vip` หรือกดปุ่ม "สุ่มอัตโนมัติ"
  - มีปุ่ม **คัดลอกลิงก์ย่อ (1-Click Copy)** เพื่อนำไปแชร์ต่อได้ทันที (รูปแบบ: `yourdomain.com/s/your-slug`)
  - เก็บสถิติจำนวนครั้งที่คลิกเข้าชม (Click Counter) แบบ Real-time
  - เปิด/ปิด ใช้งานลิงก์ย่อ หรือแก้ไข URL ปลายทางได้ตลอดเวลา
  - รองรับทั้ง Route `/s/[slug]` และ `/r/[slug]` พร้อมระบบตรวจจับและป้องกันข้อผิดพลาด 404

---

## 🛠️ ขั้นตอนการรัน SQL บน Supabase ใหม่

1. เข้าสู่ระบบ [https://supabase.com](https://supabase.com) และเปิดโปรเจกต์ `https://dkidksohprjhkcokdbja.supabase.co`
2. ไปที่เมนู **SQL Editor** ด้านซ้าย
3. คัดลอกโค้ดทั้งหมดในไฟล์ `supabase_schema.sql` วางลงในช่อง และกด **Run**
4. หากต้องการให้ User ใดเป็น Admin ให้รันคำสั่ง:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE username = 'YOUR_USERNAME';
```

---

## 🚀 วิธีการรันโปรเจกต์ (Local & Deploy)

```bash
# ติดตั้ง Packages
npm install

# รันโหมด Development
npm run dev
```

เปิดเว็บที่ `http://localhost:3000`
- หน้าหลัก: `http://localhost:3000`
- หน้าแดชบอร์ดสมาชิก: `http://localhost:3000/dashboard`
- หน้าจัดการหลังบ้าน Admin: `http://localhost:3000/admin`
- ตัวอย่างลิงก์ย่อ: `http://localhost:3000/s/promo`
# linktreethai
# linktreethai

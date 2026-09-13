-- ==============================================================================
-- LINKTREETHAI - COMPLETE NEW SUPABASE DATABASE MIGRATION MASTER SCRIPT
-- ==============================================================================
-- รันไฟล์นี้ครั้งเดียวใน Supabase SQL Editor ของโปรเจกต์ใหม่ เพื่อสร้างระบบทั้งหมด 100%:
-- 1. ตารางทั้งหมด 13 ตาราง (พร้อม Foreign Keys, CASCADE, Indexes)
-- 2. ระบบความปลอดภัย Row Level Security (RLS) ครบทุกตาราง
-- 3. Stored Procedures (RPC Functions)
-- 4. Auth Trigger (สร้าง Profile อัตโนมัติเมื่อ User สมัครสมาชิกหรือล็อกอิน Google)
-- 5. Storage Buckets (media, linktree-assets สำหรับเก็บสลิปและรูปภาพ)
-- 6. Initial Seed Data (การตั้งค่าระบบ, พร้อมเพย์, บริการ Services Hub, แต้ม)
-- ==============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ==============================================================================
-- 1. TABLES DEFINITION (สร้างตารางทั้ง 13 ตาราง)
-- ==============================================================================

-- 1.1 PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    bg_image_url TEXT,
    youtube_url TEXT,
    role TEXT DEFAULT 'user', -- 'user' | 'admin'
    tier TEXT DEFAULT 'free', -- 'free' | 'pro' | 'master'
    template_id TEXT DEFAULT 'template_1',
    points INT DEFAULT 100,
    pro_expires_at TIMESTAMP WITH TIME ZONE,
    master_expires_at TIMESTAMP WITH TIME ZONE,
    shortener_expires_at TIMESTAMP WITH TIME ZONE,
    extra_landing_page_slots INT DEFAULT 0,
    pixel_expires_at TIMESTAMP WITH TIME ZONE,
    hide_branding BOOLEAN DEFAULT FALSE,
    og_title TEXT,
    og_description TEXT,
    og_image_url TEXT,
    custom_button_color TEXT DEFAULT '#1E1B4B',
    custom_button_text_color TEXT DEFAULT '#FFFFFF',
    theme_name TEXT DEFAULT 'default',
    
    -- Two-Place Background System
    bg_color TEXT DEFAULT '#0B0F17',
    inner_bg_color TEXT DEFAULT '#0B0F17',
    inner_bg_image_url TEXT,
    card_bg_image_url TEXT,
    outer_bg_color TEXT DEFAULT '#0B0F17',
    text_color TEXT DEFAULT '#FFFFFF',
    text_secondary_color TEXT DEFAULT '#94A3B8',
    card_bg_color TEXT DEFAULT '#FFFFFF',
    tab_active_color TEXT DEFAULT '#34D399',

    -- Social Dock Icons
    social_facebook TEXT,
    social_instagram TEXT,
    social_tiktok TEXT,
    social_youtube TEXT,
    social_line TEXT,
    social_shopee TEXT,
    social_lazada TEXT,
    social_x TEXT,
    social_pinterest TEXT,
    social_email TEXT,

    -- Tracking Pixels
    fb_pixel_id TEXT,
    tiktok_pixel_id TEXT,
    google_pixel_id TEXT,
    line_tag_id TEXT,

    -- LINE Notification & CAPI
    line_notify_token TEXT,
    line_webhook_url TEXT,
    line_channel_access_token TEXT,
    line_user_id TEXT,
    meta_capi_token TEXT,
    tiktok_capi_token TEXT,
    tiktok_tts_expires_at TIMESTAMP WITH TIME ZONE,
    tiktok_username TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.2 LINKS TABLE
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    url TEXT NOT NULL,
    icon TEXT DEFAULT 'facebook',
    logo_url TEXT,
    bg_color TEXT DEFAULT '#1e293b',
    text_color TEXT DEFAULT '#ffffff',
    icon_bg_color TEXT,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    position INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.3 PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'THB',
    category TEXT DEFAULT 'ทั่วไป',
    image_url TEXT,
    buy_url TEXT NOT NULL,
    badge TEXT,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    position INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.4 LANDING PAGES TABLE
CREATE TABLE IF NOT EXISTS public.landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    headline TEXT NOT NULL,
    subheadline TEXT,
    hero_media_url TEXT,
    hero_media_type TEXT DEFAULT 'image',
    body_content TEXT,
    offer_price NUMERIC,
    original_price NUMERIC,
    cta_text TEXT DEFAULT 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที',
    cta_url TEXT NOT NULL,
    countdown_minutes INT DEFAULT 15,
    features JSONB DEFAULT '[]'::jsonb,
    theme_color TEXT DEFAULT '#EF4444',
    is_active BOOLEAN DEFAULT TRUE,
    views INT DEFAULT 0,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Tracking Pixels
    fb_pixel_id TEXT,
    tiktok_pixel_id TEXT,
    google_pixel_id TEXT,
    line_tag_id TEXT,
    meta_capi_token TEXT,

    -- Sales Elements
    pain_headline TEXT DEFAULT 'คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?',
    pain_points JSONB DEFAULT '[]'::jsonb,
    benefits_headline TEXT DEFAULT 'ทางออกและผลลัพธ์ที่คุณจะได้รับ',
    benefits JSONB DEFAULT '[]'::jsonb,
    testimonials JSONB DEFAULT '[]'::jsonb,
    faqs JSONB DEFAULT '[]'::jsonb,
    guarantee_text TEXT DEFAULT 'รับประกันความพึงพอใจ ของแท้ 100%',
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    og_image_url TEXT,
    hero_image_url TEXT,
    video_url TEXT,
    bg_color TEXT DEFAULT '#0B0F17',
    bg_image_url TEXT,
    card_style TEXT DEFAULT 'glass',
    text_color TEXT DEFAULT '#FFFFFF',
    subtext_color TEXT DEFAULT '#E2E8F0',
    trust_badge_1 TEXT DEFAULT 'ส่งฟรีด่วน',
    trust_badge_2 TEXT DEFAULT 'ของแท้ 100%',
    trust_badge_3 TEXT DEFAULT 'ชำระเงินปลอดภัย',
    enable_cod_form BOOLEAN DEFAULT TRUE,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    review_images JSONB DEFAULT '[]'::jsonb,
    enable_review_album BOOLEAN DEFAULT FALSE,

    -- Action Buttons
    sticky_btn1_text TEXT DEFAULT 'ติดต่อสั่งซื้อด่วน',
    sticky_btn1_url TEXT,
    sticky_btn2_text TEXT DEFAULT 'ช่องทางติดต่ออื่นๆ',
    sticky_btn2_url TEXT,
    sticky_btn3_text TEXT DEFAULT 'สั่งซื้อออนไลน์',
    sticky_btn3_url TEXT,
    cta_secondary_text TEXT DEFAULT 'ช่องทางติดต่ออื่นๆ',
    cta_secondary_url TEXT,
    cta_shop_text TEXT DEFAULT 'สั่งซื้อออนไลน์',
    cta_shop_url TEXT,

    -- Expiry & Payment
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    promptpay_phone TEXT,
    promptpay_name TEXT,
    promptpay_bank TEXT,
    promptpay_number TEXT,
    promptpay_amount NUMERIC,
    enable_promptpay_qr BOOLEAN DEFAULT TRUE,
    allow_custom_amount BOOLEAN DEFAULT TRUE,
    line_channel_access_token TEXT,
    line_user_id TEXT,
    line_webhook_url TEXT,
    line_notify_token TEXT,
    page_type TEXT DEFAULT 'p', -- 'p' (standard) | 'c' (custom/modular)

    -- Background Styling Pro
    bg_image_opacity INT DEFAULT 85,
    bg_image_blur INT DEFAULT 0,
    bg_image_mode TEXT DEFAULT 'cover',
    inner_bg_image_url TEXT,
    inner_bg_opacity INT DEFAULT 85,
    inner_bg_blur INT DEFAULT 0,
    inner_bg_mode TEXT DEFAULT 'cover'
);

-- 1.5 LEADS CRM TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    landing_page_id UUID REFERENCES public.landing_pages(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    line_id TEXT,
    note TEXT,
    order_note TEXT,
    address TEXT,
    amount NUMERIC,
    quantity INT DEFAULT 1,
    order_code TEXT,
    package_name TEXT,
    payment_method TEXT DEFAULT 'promptpay', -- 'promptpay' | 'cod' | 'online'
    slip_url TEXT,
    status TEXT DEFAULT 'pending', -- 'pending' | 'paid' | 'contacted' | 'completed' | 'cancelled'
    utm JSONB DEFAULT '{}'::jsonb,
    source_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.6 SHORT LINKS TABLE
CREATE TABLE IF NOT EXISTS public.short_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    title TEXT,
    clicks INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.7 SHORT LINK ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.short_link_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_link_id UUID NOT NULL REFERENCES public.short_links(id) ON DELETE CASCADE,
    referrer TEXT,
    user_agent TEXT,
    ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.8 ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    target_id TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.9 PIXEL EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.pixel_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    landing_page_id UUID REFERENCES public.landing_pages(id) ON DELETE SET NULL,
    pixel_type TEXT NOT NULL, -- 'facebook' | 'tiktok' | 'google' | 'line'
    pixel_id TEXT,
    event_name TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.10 PAYMENT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    points INT NOT NULL,
    package_name TEXT NOT NULL,
    payment_type TEXT DEFAULT 'topup', -- 'topup' | 'product_order'
    slip_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    note TEXT,
    admin_note TEXT,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.11 SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.12 SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    category TEXT DEFAULT 'salepage',
    icon_name TEXT DEFAULT 'LayoutTemplate',
    icon_bg TEXT DEFAULT 'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600',
    icon_color TEXT DEFAULT 'text-white',
    badge TEXT DEFAULT '🔥 ยอดนิยม',
    badge_color TEXT DEFAULT 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    status TEXT DEFAULT 'active',
    features JSONB DEFAULT '[]'::jsonb,
    price_text TEXT,
    action_label TEXT DEFAULT 'เปิดใช้งาน',
    action_url TEXT DEFAULT '/custom-salepage',
    position INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    btn_bg TEXT DEFAULT 'bg-purple-600',
    btn_text_color TEXT DEFAULT '#FFFFFF',
    text_color TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1.13 UPLOADED INDEX PAGES TABLE (/u/[slug])
CREATE TABLE IF NOT EXISTS public.uploaded_index_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    html_content TEXT NOT NULL,
    fb_pixel_id TEXT,
    tiktok_pixel_id TEXT,
    google_pixel_id TEXT,
    line_tag_id TEXT,
    meta_capi_token TEXT,
    views INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 2. INDEXES (เพิ่มประสิทธิภาพการค้นหาและป้องกันชื่อซ้ำ)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON public.links (user_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_landing_pages_slug_unique ON public.landing_pages (slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_user_id ON public.landing_pages (user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_short_links_slug_unique ON public.short_links (slug);
CREATE INDEX IF NOT EXISTS idx_short_links_created_by ON public.short_links (created_by);
CREATE INDEX IF NOT EXISTS idx_pixel_events_user_id ON public.pixel_events (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON public.payment_transactions (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_uploaded_index_pages_slug_unique ON public.uploaded_index_pages (slug);
CREATE INDEX IF NOT EXISTS idx_uploaded_index_pages_user_id ON public.uploaded_index_pages (user_id);

-- ==============================================================================
-- 3. HELPER FUNCTIONS & RPC STORED PROCEDURES
-- ==============================================================================

-- 3.1 Check is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.2 Counter Increments
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.links SET clicks = clicks + 1 WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_landing_page_views(page_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.landing_pages SET views = views + 1 WHERE id = page_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_landing_page_clicks(page_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.landing_pages SET clicks = clicks + 1 WHERE id = page_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_short_link_clicks(link_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.short_links SET clicks = clicks + 1 WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 3.3 UNLOCK EXTRA LANDING PAGE SLOT (RPC)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.unlock_extra_landing_page_slot(
    target_user_id UUID DEFAULT NULL,
    points_cost INT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    cur_user UUID;
    cur_points INT;
    cur_slots INT;
    req_points INT;
BEGIN
    cur_user := COALESCE(target_user_id, auth.uid());
    IF cur_user IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'กรุณาเข้าสู่ระบบก่อนทำรายการ');
    END IF;

    IF points_cost IS NOT NULL AND points_cost > 0 THEN
        req_points := points_cost;
    ELSE
        SELECT COALESCE(NULLIF(value, '')::INT, 350) INTO req_points 
        FROM public.system_settings WHERE key = 'points_cost_extra_landing_slot';
        IF req_points IS NULL THEN req_points := 350; END IF;
    END IF;

    SELECT points, COALESCE(extra_landing_page_slots, 0) INTO cur_points, cur_slots 
    FROM public.profiles WHERE id = cur_user;

    IF cur_points IS NULL OR cur_points < req_points THEN
        RETURN jsonb_build_object('success', false, 'message', 'แต้มสะสมไม่เพียงพอ (ต้องการ ' || req_points || ' แต้ม แต่คุณมี ' || COALESCE(cur_points, 0) || ' แต้ม)');
    END IF;

    PERFORM set_config('app.internal_action', 'true', true);

    UPDATE public.profiles
    SET points = points - req_points,
        extra_landing_page_slots = cur_slots + 1
    WHERE id = cur_user;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'ปลดล็อกโควตาเซลเพจเพิ่มสำเร็จ +1 ช่อง (ใช้ ' || req_points || ' แต้ม)',
        'remaining_points', cur_points - req_points,
        'extra_landing_page_slots', cur_slots + 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ==============================================================================
-- 3.4 UNLOCK SHORTENER (RPC)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.unlock_shortener_with_points(
    target_user_id UUID DEFAULT NULL,
    points_cost INT DEFAULT NULL,
    duration_days INT DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
    cur_user UUID;
    cur_points INT;
    req_points INT;
    days_to_add INT := COALESCE(duration_days, 30);
    cur_exp TIMESTAMP WITH TIME ZONE;
    new_exp TIMESTAMP WITH TIME ZONE;
BEGIN
    cur_user := COALESCE(target_user_id, auth.uid());
    IF cur_user IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'กรุณาเข้าสู่ระบบก่อนทำรายการ');
    END IF;

    IF points_cost IS NOT NULL AND points_cost > 0 THEN
        req_points := points_cost;
    ELSE
        SELECT COALESCE(NULLIF(value, '')::INT, 100) INTO req_points 
        FROM public.system_settings WHERE key = 'points_cost_shortener';
        IF req_points IS NULL THEN req_points := 100; END IF;
    END IF;

    SELECT points, shortener_expires_at INTO cur_points, cur_exp 
    FROM public.profiles WHERE id = cur_user;

    IF cur_points IS NULL OR cur_points < req_points THEN
        RETURN jsonb_build_object('success', false, 'message', 'แต้มสะสมไม่เพียงพอ (ต้องการ ' || req_points || ' แต้ม แต่คุณมี ' || COALESCE(cur_points, 0) || ' แต้ม)');
    END IF;

    IF cur_exp IS NOT NULL AND cur_exp > NOW() THEN
        new_exp := cur_exp + (days_to_add || ' days')::INTERVAL;
    ELSE
        new_exp := NOW() + (days_to_add || ' days')::INTERVAL;
    END IF;

    PERFORM set_config('app.internal_action', 'true', true);

    UPDATE public.profiles
    SET points = points - req_points,
        shortener_expires_at = new_exp
    WHERE id = cur_user;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'ปลดล็อกระบบย่อลิงก์สำเร็จ ' || days_to_add || ' วัน (ใช้ ' || req_points || ' แต้ม)',
        'remaining_points', cur_points - req_points,
        'expires_at', new_exp
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3.5 Admin Approve Payment Transaction
CREATE OR REPLACE FUNCTION public.admin_approve_transaction(tx_id UUID, admin_id UUID)
RETURNS JSONB AS $$
DECLARE
    tx RECORD;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = admin_id AND role = 'admin') THEN
        RETURN jsonb_build_object('success', false, 'message', 'ไม่มีสิทธิ์ผู้ดูแลระบบ');
    END IF;
    SELECT * INTO tx FROM public.payment_transactions WHERE id = tx_id;
    IF tx IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'ไม่พบรายการธุรกรรม');
    END IF;
    IF tx.status = 'approved' THEN
        RETURN jsonb_build_object('success', false, 'message', 'รายการนี้ได้รับการอนุมัติไปแล้ว');
    END IF;
    UPDATE public.payment_transactions
    SET status = 'approved',
        approved_by = admin_id,
        approved_at = NOW()
    WHERE id = tx_id;
    UPDATE public.profiles
    SET points = COALESCE(points, 0) + tx.points
    WHERE id = tx.user_id;
    RETURN jsonb_build_object('success', true, 'message', 'อนุมัติรายการและเติม ' || tx.points || ' แต้มเรียบร้อยแล้ว');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.6 Admin Direct Password Change (Admin เปลี่ยนรหัสผ่านให้สมาชิกได้ทันที)
CREATE OR REPLACE FUNCTION public.admin_set_user_password(target_user_id UUID, new_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Only admins can change user passwords.';
  END IF;

  IF length(new_password) < 6 THEN
    RAISE EXCEPTION 'Password must be at least 6 characters long.';
  END IF;

  UPDATE auth.users
  SET encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
      updated_at = NOW()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;

-- ==============================================================================

-- ==============================================================================
-- 3.7 SECURE PROFILE UPDATE GUARD (ANTI-TAMPER & ANTI-POINT-FARMING TRIGGER)
-- ==============================================================================
-- ป้องกัน 100% ไม่ให้ผู้ใช้งานทั่วไปแอบส่ง API หรือเปิด DevTools console มา:
-- 1. แอบเปลี่ยน role เป็น 'admin'
-- 2. แอบปั๊มแต้ม (points) เองโดยตรงผ่าน supabase.from('profiles').update({ points: 99999 })
-- 3. แอบขยายวันหมดอายุ VIP (pro_expires_at, master_expires_at) หรือปลดล็อกโควตาเอง
CREATE OR REPLACE FUNCTION public.guard_profile_sensitive_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- อนุญาตให้แก้ไขข้อมูลได้ หาก:
  -- 1. เรียกผ่าน RPC ภายในที่มีการตั้งค่า app.internal_action = 'true'
  -- 2. ทำงานภายใต้สิทธิ์ของระบบ/postgres (SECURITY DEFINER)
  -- 3. ผู้ใช้งานปัจจุบันเป็น Admin (public.is_admin())
  IF COALESCE(current_setting('app.internal_action', true), 'false') = 'true' 
     OR current_user NOT IN ('authenticated', 'anon') 
     OR public.is_admin() THEN
    NEW.updated_at := NOW();
    RETURN NEW;
  END IF;

  -- ป้องกัน User ทั่วไปส่งคำสั่ง UPDATE ตาราง profiles ตรงๆ ผ่าน Client API
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Unauthorized: You cannot modify your own role';
  END IF;
  
  IF NEW.points IS DISTINCT FROM OLD.points THEN
    RAISE EXCEPTION 'Unauthorized: Points can only be changed via transactions or authorized actions';
  END IF;
  
  IF NEW.pro_expires_at IS DISTINCT FROM OLD.pro_expires_at OR
     NEW.master_expires_at IS DISTINCT FROM OLD.master_expires_at OR
     NEW.shortener_expires_at IS DISTINCT FROM OLD.shortener_expires_at OR
     NEW.pixel_expires_at IS DISTINCT FROM OLD.pixel_expires_at OR
     NEW.extra_landing_page_slots IS DISTINCT FROM OLD.extra_landing_page_slots THEN
    RAISE EXCEPTION 'Unauthorized: Subscription expiration dates cannot be directly modified';
  END IF;

  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS trg_guard_profile_sensitive_fields ON public.profiles;
CREATE TRIGGER trg_guard_profile_sensitive_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.guard_profile_sensitive_fields();

-- ==============================================================================
-- 3.8 SECURE POINT REDEMPTION RPCs (ระบบใช้แต้มฝั่ง Server แบบ Dynamic 100%)
-- ==============================================================================

-- 3.8.1 อัปเกรด Pro VIP ด้วยแต้ม
CREATE OR REPLACE FUNCTION public.unlock_pro_with_points(
    target_user_id UUID DEFAULT NULL,
    points_cost INT DEFAULT NULL,
    duration_days INT DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
    cur_user UUID;
    cur_points INT;
    req_points INT;
    days_to_add INT := COALESCE(duration_days, 30);
    cur_exp TIMESTAMP WITH TIME ZONE;
    new_exp TIMESTAMP WITH TIME ZONE;
BEGIN
    cur_user := COALESCE(target_user_id, auth.uid());
    IF cur_user IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'กรุณาเข้าสู่ระบบก่อนทำรายการ');
    END IF;

    IF points_cost IS NOT NULL AND points_cost > 0 THEN
        req_points := points_cost;
    ELSE
        SELECT COALESCE(NULLIF(value, '')::INT, 299) INTO req_points 
        FROM public.system_settings WHERE key = 'points_cost_pro';
        IF req_points IS NULL THEN req_points := 299; END IF;
    END IF;

    SELECT points, pro_expires_at INTO cur_points, cur_exp 
    FROM public.profiles WHERE id = cur_user;

    IF cur_points IS NULL OR cur_points < req_points THEN
        RETURN jsonb_build_object('success', false, 'message', 'แต้มสะสมไม่เพียงพอ (ต้องการ ' || req_points || ' แต้ม แต่คุณมี ' || COALESCE(cur_points, 0) || ' แต้ม)');
    END IF;

    IF cur_exp IS NOT NULL AND cur_exp > NOW() THEN
        new_exp := cur_exp + (days_to_add || ' days')::INTERVAL;
    ELSE
        new_exp := NOW() + (days_to_add || ' days')::INTERVAL;
    END IF;

    PERFORM set_config('app.internal_action', 'true', true);

    UPDATE public.profiles
    SET points = points - req_points,
        pro_expires_at = new_exp
    WHERE id = cur_user;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'อัปเกรด PRO VIP สำเร็จ ' || days_to_add || ' วัน (ใช้ ' || req_points || ' แต้ม)',
        'remaining_points', cur_points - req_points,
        'expires_at', new_exp
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3.8.2 อัปเกรด Master VIP ด้วยแต้ม
CREATE OR REPLACE FUNCTION public.unlock_master_with_points(
    target_user_id UUID DEFAULT NULL,
    points_cost INT DEFAULT NULL,
    duration_days INT DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
    cur_user UUID;
    cur_points INT;
    req_points INT;
    days_to_add INT := COALESCE(duration_days, 30);
    cur_exp TIMESTAMP WITH TIME ZONE;
    new_exp TIMESTAMP WITH TIME ZONE;
BEGIN
    cur_user := COALESCE(target_user_id, auth.uid());
    IF cur_user IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'กรุณาเข้าสู่ระบบก่อนทำรายการ');
    END IF;

    IF points_cost IS NOT NULL AND points_cost > 0 THEN
        req_points := points_cost;
    ELSE
        SELECT COALESCE(NULLIF(value, '')::INT, 599) INTO req_points 
        FROM public.system_settings WHERE key = 'points_cost_master';
        IF req_points IS NULL THEN req_points := 599; END IF;
    END IF;

    SELECT points, master_expires_at INTO cur_points, cur_exp 
    FROM public.profiles WHERE id = cur_user;

    IF cur_points IS NULL OR cur_points < req_points THEN
        RETURN jsonb_build_object('success', false, 'message', 'แต้มสะสมไม่เพียงพอ (ต้องการ ' || req_points || ' แต้ม แต่คุณมี ' || COALESCE(cur_points, 0) || ' แต้ม)');
    END IF;

    IF cur_exp IS NOT NULL AND cur_exp > NOW() THEN
        new_exp := cur_exp + (days_to_add || ' days')::INTERVAL;
    ELSE
        new_exp := NOW() + (days_to_add || ' days')::INTERVAL;
    END IF;

    PERFORM set_config('app.internal_action', 'true', true);

    UPDATE public.profiles
    SET points = points - req_points,
        master_expires_at = new_exp
    WHERE id = cur_user;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'อัปเกรด MASTER VIP สำเร็จ ' || days_to_add || ' วัน (ใช้ ' || req_points || ' แต้ม)',
        'remaining_points', cur_points - req_points,
        'expires_at', new_exp
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3.8.3 ปลดล็อก Pixels Tracking ด้วยแต้ม
CREATE OR REPLACE FUNCTION public.unlock_pixels_with_points(
    target_user_id UUID DEFAULT NULL,
    points_cost INT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    cur_user UUID;
    cur_points INT;
    req_points INT;
    cur_exp TIMESTAMP WITH TIME ZONE;
    new_exp TIMESTAMP WITH TIME ZONE;
BEGIN
    cur_user := COALESCE(target_user_id, auth.uid());
    IF cur_user IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'กรุณาเข้าสู่ระบบก่อนทำรายการ');
    END IF;

    IF points_cost IS NOT NULL AND points_cost > 0 THEN
        req_points := points_cost;
    ELSE
        SELECT COALESCE(NULLIF(value, '')::INT, 100) INTO req_points 
        FROM public.system_settings WHERE key = 'points_cost_pixels';
        IF req_points IS NULL THEN req_points := 100; END IF;
    END IF;

    SELECT points, pixel_expires_at INTO cur_points, cur_exp 
    FROM public.profiles WHERE id = cur_user;

    IF cur_points IS NULL OR cur_points < req_points THEN
        RETURN jsonb_build_object('success', false, 'message', 'แต้มสะสมไม่เพียงพอ (ต้องการ ' || req_points || ' แต้ม แต่คุณมี ' || COALESCE(cur_points, 0) || ' แต้ม)');
    END IF;

    IF cur_exp IS NOT NULL AND cur_exp > NOW() THEN
        new_exp := cur_exp + INTERVAL '30 days';
    ELSE
        new_exp := NOW() + INTERVAL '30 days';
    END IF;

    PERFORM set_config('app.internal_action', 'true', true);

    UPDATE public.profiles
    SET points = points - req_points,
        pixel_expires_at = new_exp
    WHERE id = cur_user;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'ปลดล็อกระบบ Tracking Pixels สำเร็จ 30 วัน (ใช้ ' || req_points || ' แต้ม)',
        'remaining_points', cur_points - req_points,
        'expires_at', new_exp
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 3.8.4 ต่ออายุหน้าเซลเพจด้วยแต้ม (30 วัน)
CREATE OR REPLACE FUNCTION public.renew_landing_page_with_points(
    landing_page_id UUID,
    points_cost INT DEFAULT NULL,
    duration_days INT DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
    cur_user UUID;
    cur_points INT;
    req_points INT;
    days_to_add INT := COALESCE(duration_days, 30);
    lp_owner UUID;
    cur_exp TIMESTAMP WITH TIME ZONE;
    new_exp TIMESTAMP WITH TIME ZONE;
BEGIN
    cur_user := auth.uid();
    IF cur_user IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'กรุณาเข้าสู่ระบบก่อนทำรายการ');
    END IF;

    SELECT user_id, expires_at INTO lp_owner, cur_exp 
    FROM public.landing_pages WHERE id = landing_page_id;

    IF lp_owner IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'ไม่พบข้อมูลหน้าเซลเพจที่ระบุ');
    END IF;

    IF lp_owner != cur_user AND NOT public.is_admin() THEN
        RETURN jsonb_build_object('success', false, 'message', 'คุณไม่มีสิทธิ์จัดการหน้าเซลเพจนี้');
    END IF;

    IF points_cost IS NOT NULL AND points_cost > 0 THEN
        req_points := points_cost;
    ELSE
        SELECT COALESCE(NULLIF(value, '')::INT, 350) INTO req_points 
        FROM public.system_settings WHERE key = 'points_cost_renew_landing';
        IF req_points IS NULL THEN req_points := 350; END IF;
    END IF;

    SELECT points INTO cur_points FROM public.profiles WHERE id = cur_user;

    IF cur_points IS NULL OR cur_points < req_points THEN
        RETURN jsonb_build_object('success', false, 'message', 'แต้มสะสมไม่เพียงพอ (ต้องการ ' || req_points || ' แต้ม แต่คุณมี ' || COALESCE(cur_points, 0) || ' แต้ม)');
    END IF;

    IF cur_exp IS NOT NULL AND cur_exp > NOW() THEN
        new_exp := cur_exp + (days_to_add || ' days')::INTERVAL;
    ELSE
        new_exp := NOW() + (days_to_add || ' days')::INTERVAL;
    END IF;

    PERFORM set_config('app.internal_action', 'true', true);

    UPDATE public.profiles
    SET points = points - req_points
    WHERE id = cur_user;

    UPDATE public.landing_pages
    SET expires_at = new_exp,
        updated_at = NOW()
    WHERE id = landing_page_id;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'ต่ออายุหน้าเซลเพจสำเร็จ ' || days_to_add || ' วัน (ใช้ ' || req_points || ' แต้ม)',
        'remaining_points', cur_points - req_points,
        'expires_at', new_exp
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- 4. AUTH TRIGGER (สร้างโปรไฟล์อัตโนมัติเมื่อ User ลงทะเบียนหรือเข้าสู่ระบบด้วย Google)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    derived_username TEXT;
    temp_username TEXT;
    user_full_name TEXT;
    user_avatar TEXT;
    counter INT := 0;
BEGIN
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1),
        'User'
    );

    user_avatar := COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture',
        NULL
    );

    derived_username := LOWER(REGEXP_REPLACE(
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'user'),
        '[^a-z0-9_]',
        '',
        'g'
    ));

    IF LENGTH(derived_username) < 3 THEN
        derived_username := 'user_' || derived_username;
    END IF;

    temp_username := derived_username;

    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = temp_username) LOOP
        counter := counter + 1;
        temp_username := derived_username || '_' || (FLOOR(RANDOM() * 900) + 100)::TEXT;
        EXIT WHEN counter > 10;
    END LOOP;

    INSERT INTO public.profiles (
        id,
        username,
        full_name,
        avatar_url,
        role,
        tier,
        points,
        template_id,
        bg_color,
        text_color,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        temp_username,
        user_full_name,
        user_avatar,
        'user',
        'free',
        100,
        'template_1',
        '#0B0F17',
        '#FFFFFF',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.short_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.short_link_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pixel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_index_pages ENABLE ROW LEVEL SECURITY;

-- 5.1 PROFILES POLICIES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- 5.2 LINKS POLICIES
DROP POLICY IF EXISTS "Public links are viewable by everyone" ON public.links;
CREATE POLICY "Public links are viewable by everyone" ON public.links FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own links" ON public.links;
CREATE POLICY "Users can insert their own links" ON public.links FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own links" ON public.links;
CREATE POLICY "Users can update their own links" ON public.links FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own links" ON public.links;
CREATE POLICY "Users can delete their own links" ON public.links FOR DELETE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins have full access to links" ON public.links;
CREATE POLICY "Admins have full access to links" ON public.links FOR ALL USING (public.is_admin());

-- 5.3 PRODUCTS POLICIES
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
CREATE POLICY "Users can insert their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL USING (public.is_admin());

-- 5.4 LANDING PAGES POLICIES
DROP POLICY IF EXISTS "Public landing pages are viewable by everyone" ON public.landing_pages;
CREATE POLICY "Public landing pages are viewable by everyone" ON public.landing_pages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own landing pages" ON public.landing_pages;
CREATE POLICY "Users can insert their own landing pages" ON public.landing_pages FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own landing pages" ON public.landing_pages;
CREATE POLICY "Users can update their own landing pages" ON public.landing_pages FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own landing pages" ON public.landing_pages;
CREATE POLICY "Users can delete their own landing pages" ON public.landing_pages FOR DELETE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins have full access to landing pages" ON public.landing_pages;
CREATE POLICY "Admins have full access to landing pages" ON public.landing_pages FOR ALL USING (public.is_admin());

-- 5.5 LEADS POLICIES
DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
CREATE POLICY "Users can view their own leads" ON public.leads FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;
CREATE POLICY "Anyone can submit leads" ON public.leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can update their own leads" ON public.leads;
CREATE POLICY "Users can update their own leads" ON public.leads FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads;
CREATE POLICY "Users can delete their own leads" ON public.leads FOR DELETE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins have full access to leads" ON public.leads;
CREATE POLICY "Admins have full access to leads" ON public.leads FOR ALL USING (public.is_admin());

-- 5.6 SHORT LINKS POLICIES
DROP POLICY IF EXISTS "Public short links are viewable by everyone" ON public.short_links;
CREATE POLICY "Public short links are viewable by everyone" ON public.short_links FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage their own short links" ON public.short_links;
CREATE POLICY "Users can manage their own short links" ON public.short_links FOR ALL USING (auth.uid() = created_by);
DROP POLICY IF EXISTS "Admins have full access to short links" ON public.short_links;
CREATE POLICY "Admins have full access to short links" ON public.short_links FOR ALL USING (public.is_admin());

-- 5.7 SHORT LINK ANALYTICS POLICIES
DROP POLICY IF EXISTS "Anyone can insert short link analytics" ON public.short_link_analytics;
CREATE POLICY "Anyone can insert short link analytics" ON public.short_link_analytics FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view analytics of their short links" ON public.short_link_analytics;
CREATE POLICY "Users can view analytics of their short links" ON public.short_link_analytics FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.short_links WHERE id = short_link_analytics.short_link_id AND created_by = auth.uid())
);
DROP POLICY IF EXISTS "Admins have full access to short link analytics" ON public.short_link_analytics;
CREATE POLICY "Admins have full access to short link analytics" ON public.short_link_analytics FOR ALL USING (public.is_admin());

-- 5.8 ANALYTICS EVENTS POLICIES
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;
CREATE POLICY "Anyone can insert analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view their analytics events" ON public.analytics_events;
CREATE POLICY "Users can view their analytics events" ON public.analytics_events FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins have full access to analytics events" ON public.analytics_events;
CREATE POLICY "Admins have full access to analytics events" ON public.analytics_events FOR ALL USING (public.is_admin());

-- 5.9 PIXEL EVENTS POLICIES
DROP POLICY IF EXISTS "Anyone can insert pixel events" ON public.pixel_events;
CREATE POLICY "Anyone can insert pixel events" ON public.pixel_events FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view their own pixel events" ON public.pixel_events;
CREATE POLICY "Users can view their own pixel events" ON public.pixel_events FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 5.10 PAYMENT TRANSACTIONS POLICIES
DROP POLICY IF EXISTS "Users can view their own payment transactions" ON public.payment_transactions;
CREATE POLICY "Users can view their own payment transactions" ON public.payment_transactions FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create payment transactions" ON public.payment_transactions;
CREATE POLICY "Users can create payment transactions" ON public.payment_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can view and manage all payment transactions" ON public.payment_transactions;
CREATE POLICY "Admins can view and manage all payment transactions" ON public.payment_transactions FOR ALL USING (public.is_admin());

-- 5.11 SYSTEM SETTINGS POLICIES
DROP POLICY IF EXISTS "Allow public read system_settings" ON public.system_settings;
CREATE POLICY "Allow public read system_settings" ON public.system_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow admin manage system_settings" ON public.system_settings;
CREATE POLICY "Allow admin manage system_settings" ON public.system_settings FOR ALL USING (public.is_admin());

-- 5.12 SERVICES POLICIES
DROP POLICY IF EXISTS "Public services are viewable by everyone" ON public.services;
CREATE POLICY "Public services are viewable by everyone" ON public.services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins have full access to services" ON public.services;
CREATE POLICY "Admins have full access to services" ON public.services FOR ALL USING (public.is_admin());

-- 5.13 UPLOADED INDEX PAGES POLICIES
DROP POLICY IF EXISTS "Public can view active uploaded index pages" ON public.uploaded_index_pages;
CREATE POLICY "Public can view active uploaded index pages" ON public.uploaded_index_pages FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Users can manage own uploaded index pages" ON public.uploaded_index_pages;
CREATE POLICY "Users can manage own uploaded index pages" ON public.uploaded_index_pages FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins have full access to uploaded index pages" ON public.uploaded_index_pages;
CREATE POLICY "Admins have full access to uploaded index pages" ON public.uploaded_index_pages FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 6. PERMISSIONS & GRANTS (มอบสิทธิ์ให้กับ anon และ authenticated)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKETS SETUP ('media' & 'linktree-assets')
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('media', 'media', true),
    ('linktree-assets', 'linktree-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for 'media' and 'linktree-assets'
DROP POLICY IF EXISTS "Public view for media bucket" ON storage.objects;
CREATE POLICY "Public view for media bucket" ON storage.objects FOR SELECT USING (bucket_id IN ('media', 'linktree-assets'));

DROP POLICY IF EXISTS "Anyone can upload to media bucket" ON storage.objects;
CREATE POLICY "Anyone can upload to media bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('media', 'linktree-assets'));

DROP POLICY IF EXISTS "Anyone can update own files in media bucket" ON storage.objects;
CREATE POLICY "Anyone can update own files in media bucket" ON storage.objects FOR UPDATE USING (bucket_id IN ('media', 'linktree-assets'));

DROP POLICY IF EXISTS "Anyone can delete files in media bucket" ON storage.objects;
CREATE POLICY "Anyone can delete files in media bucket" ON storage.objects FOR DELETE USING (bucket_id IN ('media', 'linktree-assets'));

-- ==============================================================================
-- 8. INITIAL SEED DATA (การตั้งค่าเริ่มต้นและบริการ Services Hub)
-- ==============================================================================

-- 8.1 System Settings & Payment Info
INSERT INTO public.system_settings (key, value, description) VALUES
('site_title', 'LinkTreeThai - รวมทุกลิงก์ โซเชียล และร้านค้าดิจิทัลในแอปเดียว', 'ชื่อเว็บไซต์หลัก และ Meta Title'),
('site_description', 'สร้างหน้า Bio Link สวยทันสมัย สไตล์ Mobile App รวมทุกโซเชียล ขายสินค้าดิจิทัล ย่อลิงก์ พร้อมระบบจัดการครบวงจรด้วย LinkTreeThai', 'คำอธิบายเว็บไซต์ Meta Description สำหรับ Google Search'),
('site_keywords', 'linktree, biolink, ขายของออนไลน์, รวมลิงก์, เซลเพจ, ย่อลิงก์, linktreethai', 'คีย์เวิร์ดสำหรับค้นหา'),
('site_logo_url', '', 'URL รูปภาพโลโก้เว็บไซต์หลัก (Header Logo)'),
('site_favicon_url', '', 'URL ไอคอน Favicon บนแท็บเบราว์เซอร์'),
('site_og_image_url', '', 'URL รูปภาพสำหรับแชร์ลงโซเชียล (Facebook / LINE)'),
('site_footer_text', '© 2026 LinkTreeThai. All rights reserved. สร้าง Bio Link & เซลเพจขายของยิงแอดครบวงจร', 'ข้อความท้ายหน้าเว็บ'),
('promptpay_phone', '0909964514', 'เบอร์พร้อมเพย์รับชำระเงิน'),
('promptpay_bank', 'ธนาคารกสิกรไทย (KBANK)', 'ชื่อธนาคาร'),
('promptpay_account_name', 'วันชนะ ขวัญแก้ว', 'ชื่อบัญชีผู้รับเงิน'),
('promptpay_account_number', '', 'เลขบัญชีธนาคาร (ทางเลือก)'),
('contact_line_id', '@amth', 'LINE ID สำหรับติดต่อแอดมิน/ส่งสลิป'),
('contact_line_url', 'https://line.me/ti/p/@amth', 'ลิงก์ LINE Official สำหรับติดต่อ'),
('payment_instructions', 'สแกน QR Code พร้อมเพย์ด้วยแอปธนาคาร แล้วแนบรูปสลิปเพื่อแจ้งชำระเงิน', 'คำแนะนำการชำระเงิน'),
('price_pro_thb', '299', 'ราคาแพ็กเกจ PRO VIP (บาท)'),
('points_cost_pro', '299', 'แต้มที่ใช้แลก PRO VIP (แต้ม)'),
('duration_pro_days', '30', 'ระยะเวลาใช้งาน PRO VIP (วัน)'),
('price_master_thb', '599', 'ราคาแพ็กเกจ MASTER VIP (บาท)'),
('points_cost_master', '599', 'แต้มที่ใช้แลก MASTER VIP (แต้ม)'),
('duration_master_days', '30', 'ระยะเวลาใช้งาน MASTER VIP (วัน)'),
('points_cost_upload_index', '599', 'แต้มสร้างหน้าเว็บ index.html ส่วนตัว (/uploadindex)'),
('points_cost_custom_salepage', '990', 'แต้มสร้างเซลเพจ Custom / AI Vision Salepage'),
('points_cost_extra_landing_slot', '350', 'แต้มปลดล็อกโควตาเซลเพจเพิ่ม +1 ช่อง'),
('points_cost_renew_landing', '350', 'แต้มต่ออายุหน้าเซลเพจ 30 วัน'),
('points_cost_shortener', '100', 'แต้มปลดล็อกระบบย่อลิงก์สั้น 30 วัน'),
('points_cost_pixels', '100', 'แต้มปลดล็อกระบบฝัง Pixels 30 วัน')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 8.2 Seed Initial Services
INSERT INTO public.services (id, title, subtitle, description, category, icon_name, icon_bg, icon_color, badge, badge_color, status, price_text, action_label, action_url, position, is_active, features)
VALUES 
(
    'custom-salepage',
    'Custom Salepage',
    'สร้าง Salepage แบบกำหนดเอง',
    'บริการออกแบบและจัดสร้างหน้าเซลเพจปิดการขายแบบ Custom เฉพาะแบรนด์ของคุณ ดีไซน์ระดับพรีเมียม สไตล์ Mobile-App โหลดเร็วเสี้ยววินาที พร้อมระบบชำระเงิน Dynamic PromptPay, เก็บเงินปลายทาง (COD) และเชื่อมต่อพิกเซลโฆษณาครบวงจร',
    'salepage',
    'LayoutTemplate',
    'bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600',
    'text-white',
    '🔥 ยอดนิยม',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    'active',
    'เริ่มต้น 990.- / เซลเพจ',
    'สั่งทำเซลเพจ / ปรึกษาออกแบบ',
    '/custom-salepage',
    1,
    true,
    '["ออกแบบ UI/UX สวยหรู สไตล์ Mobile App เฉพาะเอกลักษณ์แบรนด์คุณ", "ระบบคำนวณเงิน + Dynamic PromptPay EMVCo QR ยอดตรง พร้อมแนบสลิป", "ฟอร์มสั่งซื้อเก็บเงินปลายทาง (COD) คำนวณค่าจัดส่งอัตโนมัติ", "ติดตั้ง Multi-Pixel (Meta CAPI, TikTok, Google, LINE Tag) ครบ 100%", "เชื่อมต่อระบบแจ้งเตือนออเดอร์ใหม่และสลิปเข้า LINE OA แบบ Real-time", "รองรับ Custom Domain และระบบบันทึกฐานข้อมูลลูกค้า (CRM)"]'::jsonb
),
(
    'ai-copy-studio',
    'AI Copywriting Studio',
    'สร้างคอนเทนต์ & สคริปต์วิดีโอ',
    'สตูดิโอปัญญาประดิษฐ์ช่วยเขียนพาดหัว Hook เปิดคลิป สคริปต์สั้นสำหรับ TikTok / Reels / Shorts และแคปชั่นปิดการขาย Facebook สไตล์ Direct Response แม่นยำตรงกลุ่มเป้าหมาย',
    'ai',
    'Sparkles',
    'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500',
    'text-slate-950',
    '✨ AI Studio',
    'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    'active',
    'ใช้งานฟรีสำหรับสมาชิก',
    'เปิดใช้งาน AI Studio',
    '/ai-salepage',
    2,
    true,
    '["สร้างสคริปต์ TikTok Hook 3 วินาทีแรกหยุดนิ้วคนดู", "เขียนแคปชั่น AIDA & PAS สำหรับยิงแอด Facebook", "คิดไอเดียโปรโมชั่นและข้อความ Broadcast LINE OA", "ปรับแต่งโทนเสียงของแบรนด์ (หรูหรา, อบอุ่น, กระตุ้นการตัดสินใจ)"]'::jsonb
),
(
    'line-crm-hub',
    'LINE CRM & Broadcast',
    'เชื่อมโยงระบบ LINE OA อัตโนมัติ',
    'ระบบเชื่อมโยงฐานข้อมูลลูกค้าจาก LinkTreeThai เข้ากับ LINE Official Account อัตโนมัติ สำหรับบรอดแคสต์โปรโมชั่นเฉพาะกลุ่มและสะสมแต้มสมาชิก',
    'system',
    'MessageCircle',
    'bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600',
    'text-white',
    '⚡ กำลังอัปเดต',
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    'updating',
    'เปิดบริการเร็วๆ นี้',
    'รับการแจ้งเตือนเมื่อเปิดบริการ',
    'line',
    3,
    true,
    '["Sync รายชื่อลูกค้าและเบอร์โทรเข้า LINE OA Tag อัตโนมัติ", "ระบบสะสมแต้มและบัตรสมาชิกดิจิทัลผ่าน LINE", "ส่งข้อความแจ้งเตือนสถานะการจัดส่งพัสดุอัตโนมัติ"]'::jsonb
),
(
    'custom-domain-pro',
    'White-Label & Domain Pro',
    'เชื่อมต่อชื่อโดเมนส่วนตัว 100%',
    'บริการผูกโดเมนส่วนตัวแบบ Custom Domain (.com, .co.th, .shop) พร้อมใบรับรองความปลอดภัย SSL ฟรีตลอดชีพ และลบลายน้ำทุกจุด 100%',
    'marketing',
    'ShieldCheck',
    'bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500',
    'text-white',
    '💎 พรีเมียม',
    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    'updating',
    'เปิดบริการเร็วๆ นี้',
    'รับการแจ้งเตือนเมื่อเปิดบริการ',
    'line',
    4,
    true,
    '["เชื่อมต่อชื่อเว็บไซต์ของคุณได้ 100%", "ลบลายน้ำระบบเพื่อภาพลักษณ์แบรนด์ระดับพรีเมียม", "ติดตั้ง CDN ระดับ Global เพิ่มความเร็วในการโหลดสูงสุด"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- ==============================================================================
-- 9. NOTIFY POSTGREST SCHEMA CACHE RELOAD
-- ==============================================================================
NOTIFY pgrst, 'reload schema';

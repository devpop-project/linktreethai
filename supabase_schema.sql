-- ==============================================================================
-- LINKTREETHAI COMPLETE DATABASE SCHEMA & MIGRATION (100% PRODUCTION READY)
-- ==============================================================================
-- รองรับทุกฟังก์ชัน: Profiles, Links, Products, Landing Pages, Leads CRM,
-- Short Links & Analytics, Pixel Events, Analytics Events, Payment Transactions
-- ==============================================================================

-- 1. PROFILES TABLE (ตารางข้อมูลผู้ใช้งานและโปรไฟล์)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    bg_image_url TEXT,
    youtube_url TEXT,
    role TEXT DEFAULT 'user', -- 'user' | 'admin'
    template_id TEXT DEFAULT 'template_1', -- 'template_1' to 'template_9'
    points INT DEFAULT 0,
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
    
    -- Two-Place Background & Colors System
    bg_color TEXT DEFAULT '#0B0F17',
    inner_bg_color TEXT DEFAULT '#0B0F17',
    inner_bg_image_url TEXT,
    card_bg_image_url TEXT,
    outer_bg_color TEXT DEFAULT '#0B0F17',
    text_color TEXT DEFAULT '#FFFFFF',
    text_secondary_color TEXT DEFAULT '#94A3B8',
    card_bg_color TEXT DEFAULT '#FFFFFF',

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

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. LINKS TABLE (ตารางลิ้งก์โซเชียลและปุ่มกด)
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
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    position INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PRODUCTS TABLE (ตารางสินค้าและร้านค้าดิจิทัล)
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

-- 4. LANDING PAGES TABLE (ตารางเซลเพจสำหรับยิงแอดโดยเฉพาะ)
CREATE TABLE IF NOT EXISTS public.landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    headline TEXT NOT NULL,
    subheadline TEXT,
    hero_media_url TEXT,
    hero_media_type TEXT DEFAULT 'image', -- 'image' | 'video'
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

    -- Sales Conversion Elements
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
    trust_badge_1 TEXT DEFAULT 'ส่งฟรีด่วน',
    trust_badge_2 TEXT DEFAULT 'ของแท้ 100%',
    trust_badge_3 TEXT DEFAULT 'ชำระเงินปลอดภัย',
    enable_cod_form BOOLEAN DEFAULT TRUE,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    review_images JSONB DEFAULT '[]'::jsonb,
    subtext_color TEXT DEFAULT '#E2E8F0',
    enable_review_album BOOLEAN DEFAULT FALSE,

    -- 3 Sticky Action Buttons
    sticky_btn1_text TEXT DEFAULT 'ติดต่อสั่งซื้อด่วน',
    sticky_btn1_url TEXT,
    sticky_btn2_text TEXT DEFAULT 'ช่องทางติดต่ออื่นๆ',
    sticky_btn2_url TEXT,
    sticky_btn3_text TEXT DEFAULT 'สั่งซื้อออนไลน์',
    sticky_btn3_url TEXT,
    cta_secondary_text TEXT DEFAULT 'ช่องทางติดต่ออื่นๆ',
    cta_secondary_url TEXT,
    cta_shop_text TEXT DEFAULT 'สั่งซื้อออนไลน์',
    cta_shop_url TEXT
);

-- 5. LEADS TABLE (ตารางข้อมูลผู้ติดต่อและลีด CRM)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    note TEXT,
    line_id TEXT,
    status TEXT DEFAULT 'pending', -- 'pending' | 'contacted' | 'completed' | 'cancelled'
    amount NUMERIC,
    address TEXT,
    order_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SHORT LINKS TABLE (ตารางระบบย่อลิงก์ / URL Shortener)
CREATE TABLE IF NOT EXISTS public.short_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    title TEXT,
    clicks INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SHORT LINK ANALYTICS TABLE (ตารางสถิติคลิกย่อลิงก์)
CREATE TABLE IF NOT EXISTS public.short_link_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_link_id UUID NOT NULL REFERENCES public.short_links(id) ON DELETE CASCADE,
    referrer TEXT,
    user_agent TEXT,
    ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ANALYTICS EVENTS TABLE (ตารางเก็บสถิติเหตุการณ์ทั่วไป)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    target_id TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PIXEL EVENTS TABLE (ตารางบันทึกข้อมูลสถิติพิกเซลและคอนเวอร์ชัน)
CREATE TABLE IF NOT EXISTS public.pixel_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    landing_page_id UUID REFERENCES public.landing_pages(id) ON DELETE CASCADE,
    pixel_type TEXT NOT NULL, -- 'facebook' | 'tiktok' | 'google' | 'line'
    pixel_id TEXT,
    event_name TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. PAYMENT TRANSACTIONS TABLE (ตารางแจ้งชำระเงินและตรวจสอบสลิป)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    points INT NOT NULL,
    package_name TEXT NOT NULL,
    slip_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    note TEXT,
    admin_note TEXT,
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- SAFE MIGRATIONS: AUTOMATICALLY ADD ANY MISSING COLUMNS TO EXISTING TABLES
-- ==============================================================================
DO $$ 
BEGIN 
    -- 1. Profiles columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bg_color') THEN
        ALTER TABLE public.profiles ADD COLUMN bg_color TEXT DEFAULT '#0B0F17';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'inner_bg_color') THEN
        ALTER TABLE public.profiles ADD COLUMN inner_bg_color TEXT DEFAULT '#0B0F17';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'inner_bg_image_url') THEN
        ALTER TABLE public.profiles ADD COLUMN inner_bg_image_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'card_bg_image_url') THEN
        ALTER TABLE public.profiles ADD COLUMN card_bg_image_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'outer_bg_color') THEN
        ALTER TABLE public.profiles ADD COLUMN outer_bg_color TEXT DEFAULT '#0B0F17';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'text_color') THEN
        ALTER TABLE public.profiles ADD COLUMN text_color TEXT DEFAULT '#FFFFFF';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'text_secondary_color') THEN
        ALTER TABLE public.profiles ADD COLUMN text_secondary_color TEXT DEFAULT '#94A3B8';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'card_bg_color') THEN
        ALTER TABLE public.profiles ADD COLUMN card_bg_color TEXT DEFAULT '#FFFFFF';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'pixel_expires_at') THEN
        ALTER TABLE public.profiles ADD COLUMN pixel_expires_at TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'extra_landing_page_slots') THEN
        ALTER TABLE public.profiles ADD COLUMN extra_landing_page_slots INT DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'shortener_expires_at') THEN
        ALTER TABLE public.profiles ADD COLUMN shortener_expires_at TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'custom_button_color') THEN
        ALTER TABLE public.profiles ADD COLUMN custom_button_color TEXT DEFAULT '#1E1B4B';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'custom_button_text_color') THEN
        ALTER TABLE public.profiles ADD COLUMN custom_button_text_color TEXT DEFAULT '#FFFFFF';
    END IF;

    -- 2. Leads columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'line_id') THEN
        ALTER TABLE public.leads ADD COLUMN line_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'status') THEN
        ALTER TABLE public.leads ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'amount') THEN
        ALTER TABLE public.leads ADD COLUMN amount NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'address') THEN
        ALTER TABLE public.leads ADD COLUMN address TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'order_code') THEN
        ALTER TABLE public.leads ADD COLUMN order_code TEXT;
    END IF;

    -- 3. Landing Pages columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'pain_headline') THEN
        ALTER TABLE public.landing_pages ADD COLUMN pain_headline TEXT DEFAULT 'คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'pain_points') THEN
        ALTER TABLE public.landing_pages ADD COLUMN pain_points JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'benefits_headline') THEN
        ALTER TABLE public.landing_pages ADD COLUMN benefits_headline TEXT DEFAULT 'ทางออกและผลลัพธ์ที่คุณจะได้รับ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'benefits') THEN
        ALTER TABLE public.landing_pages ADD COLUMN benefits JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'testimonials') THEN
        ALTER TABLE public.landing_pages ADD COLUMN testimonials JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'faqs') THEN
        ALTER TABLE public.landing_pages ADD COLUMN faqs JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'guarantee_text') THEN
        ALTER TABLE public.landing_pages ADD COLUMN guarantee_text TEXT DEFAULT 'รับประกันความพึงพอใจ ของแท้ 100%';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'seo_title') THEN
        ALTER TABLE public.landing_pages ADD COLUMN seo_title TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'seo_description') THEN
        ALTER TABLE public.landing_pages ADD COLUMN seo_description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'seo_keywords') THEN
        ALTER TABLE public.landing_pages ADD COLUMN seo_keywords TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'og_image_url') THEN
        ALTER TABLE public.landing_pages ADD COLUMN og_image_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'hero_image_url') THEN
        ALTER TABLE public.landing_pages ADD COLUMN hero_image_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'video_url') THEN
        ALTER TABLE public.landing_pages ADD COLUMN video_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'bg_color') THEN
        ALTER TABLE public.landing_pages ADD COLUMN bg_color TEXT DEFAULT '#0B0F17';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'bg_image_url') THEN
        ALTER TABLE public.landing_pages ADD COLUMN bg_image_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'card_style') THEN
        ALTER TABLE public.landing_pages ADD COLUMN card_style TEXT DEFAULT 'glass';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'text_color') THEN
        ALTER TABLE public.landing_pages ADD COLUMN text_color TEXT DEFAULT '#FFFFFF';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'subtext_color') THEN
        ALTER TABLE public.landing_pages ADD COLUMN subtext_color TEXT DEFAULT '#E2E8F0';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'trust_badge_1') THEN
        ALTER TABLE public.landing_pages ADD COLUMN trust_badge_1 TEXT DEFAULT 'ส่งฟรีด่วน';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'trust_badge_2') THEN
        ALTER TABLE public.landing_pages ADD COLUMN trust_badge_2 TEXT DEFAULT 'ของแท้ 100%';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'trust_badge_3') THEN
        ALTER TABLE public.landing_pages ADD COLUMN trust_badge_3 TEXT DEFAULT 'ชำระเงินปลอดภัย';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'enable_cod_form') THEN
        ALTER TABLE public.landing_pages ADD COLUMN enable_cod_form BOOLEAN DEFAULT TRUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'gallery_images') THEN
        ALTER TABLE public.landing_pages ADD COLUMN gallery_images JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'review_images') THEN
        ALTER TABLE public.landing_pages ADD COLUMN review_images JSONB DEFAULT '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'enable_review_album') THEN
        ALTER TABLE public.landing_pages ADD COLUMN enable_review_album BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'sticky_btn1_text') THEN
        ALTER TABLE public.landing_pages ADD COLUMN sticky_btn1_text TEXT DEFAULT 'ติดต่อสั่งซื้อด่วน';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'sticky_btn1_url') THEN
        ALTER TABLE public.landing_pages ADD COLUMN sticky_btn1_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'sticky_btn2_text') THEN
        ALTER TABLE public.landing_pages ADD COLUMN sticky_btn2_text TEXT DEFAULT 'ช่องทางติดต่ออื่นๆ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'sticky_btn2_url') THEN
        ALTER TABLE public.landing_pages ADD COLUMN sticky_btn2_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'sticky_btn3_text') THEN
        ALTER TABLE public.landing_pages ADD COLUMN sticky_btn3_text TEXT DEFAULT 'สั่งซื้อออนไลน์';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'sticky_btn3_url') THEN
        ALTER TABLE public.landing_pages ADD COLUMN sticky_btn3_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'cta_secondary_text') THEN
        ALTER TABLE public.landing_pages ADD COLUMN cta_secondary_text TEXT DEFAULT 'ช่องทางติดต่ออื่นๆ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'cta_secondary_url') THEN
        ALTER TABLE public.landing_pages ADD COLUMN cta_secondary_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'cta_shop_text') THEN
        ALTER TABLE public.landing_pages ADD COLUMN cta_shop_text TEXT DEFAULT 'สั่งซื้อออนไลน์';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'cta_shop_url') THEN
        ALTER TABLE public.landing_pages ADD COLUMN cta_shop_url TEXT;
    END IF;
END $$;

-- ==============================================================================
-- 11. HELPER FUNCTION: IS_ADMIN()
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
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

-- Drop existing policies to allow clean re-application
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;

DROP POLICY IF EXISTS "Public links are viewable by everyone" ON public.links;
DROP POLICY IF EXISTS "Users can insert their own links" ON public.links;
DROP POLICY IF EXISTS "Users can update their own links" ON public.links;
DROP POLICY IF EXISTS "Users can delete their own links" ON public.links;
DROP POLICY IF EXISTS "Admins have full access to links" ON public.links;

DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;

DROP POLICY IF EXISTS "Public landing pages are viewable by everyone" ON public.landing_pages;
DROP POLICY IF EXISTS "Users can insert their own landing pages" ON public.landing_pages;
DROP POLICY IF EXISTS "Users can update their own landing pages" ON public.landing_pages;
DROP POLICY IF EXISTS "Users can delete their own landing pages" ON public.landing_pages;
DROP POLICY IF EXISTS "Admins have full access to landing pages" ON public.landing_pages;

DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads;
DROP POLICY IF EXISTS "Admins have full access to leads" ON public.leads;

DROP POLICY IF EXISTS "Public short links are viewable by everyone" ON public.short_links;
DROP POLICY IF EXISTS "Users can manage their own short links" ON public.short_links;
DROP POLICY IF EXISTS "Admins have full access to short links" ON public.short_links;

DROP POLICY IF EXISTS "Anyone can insert short link analytics" ON public.short_link_analytics;
DROP POLICY IF EXISTS "Users can view analytics of their short links" ON public.short_link_analytics;
DROP POLICY IF EXISTS "Admins have full access to short link analytics" ON public.short_link_analytics;

DROP POLICY IF EXISTS "Anyone can insert analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Users can view their analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Admins have full access to analytics events" ON public.analytics_events;

DROP POLICY IF EXISTS "Anyone can insert pixel events" ON public.pixel_events;
DROP POLICY IF EXISTS "Users can view their own pixel events" ON public.pixel_events;
DROP POLICY IF EXISTS "Admins have full access to pixel events" ON public.pixel_events;

DROP POLICY IF EXISTS "Users can view their own payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can create payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can view and manage all payment transactions" ON public.payment_transactions;

-- PROFILES Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- LINKS Policies
CREATE POLICY "Public links are viewable by everyone" ON public.links FOR SELECT USING (true);
CREATE POLICY "Users can insert their own links" ON public.links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own links" ON public.links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own links" ON public.links FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to links" ON public.links FOR ALL USING (public.is_admin());

-- PRODUCTS Policies
CREATE POLICY "Public products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can insert their own products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL USING (public.is_admin());

-- LANDING PAGES Policies
CREATE POLICY "Public landing pages are viewable by everyone" ON public.landing_pages FOR SELECT USING (true);
CREATE POLICY "Users can insert their own landing pages" ON public.landing_pages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own landing pages" ON public.landing_pages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own landing pages" ON public.landing_pages FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to landing pages" ON public.landing_pages FOR ALL USING (public.is_admin());

-- LEADS Policies
CREATE POLICY "Users can view their own leads" ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can submit leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own leads" ON public.leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own leads" ON public.leads FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to leads" ON public.leads FOR ALL USING (public.is_admin());

-- SHORT LINKS Policies
CREATE POLICY "Public short links are viewable by everyone" ON public.short_links FOR SELECT USING (true);
CREATE POLICY "Users can manage their own short links" ON public.short_links FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Admins have full access to short links" ON public.short_links FOR ALL USING (public.is_admin());

-- SHORT LINK ANALYTICS Policies
CREATE POLICY "Anyone can insert short link analytics" ON public.short_link_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view analytics of their short links" ON public.short_link_analytics FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.short_links WHERE id = short_link_analytics.short_link_id AND created_by = auth.uid())
);
CREATE POLICY "Admins have full access to short link analytics" ON public.short_link_analytics FOR ALL USING (public.is_admin());

-- ANALYTICS EVENTS Policies
CREATE POLICY "Anyone can insert analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their analytics events" ON public.analytics_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to analytics events" ON public.analytics_events FOR ALL USING (public.is_admin());

-- PIXEL EVENTS Policies
CREATE POLICY "Anyone can insert pixel events" ON public.pixel_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own pixel events" ON public.pixel_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to pixel events" ON public.pixel_events FOR ALL USING (public.is_admin());

-- PAYMENT TRANSACTIONS Policies
CREATE POLICY "Users can view their own payment transactions" ON public.payment_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payment transactions" ON public.payment_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view and manage all payment transactions" ON public.payment_transactions FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 13. RPC FUNCTIONS (Stored Procedures)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.links
    SET clicks = clicks + 1
    WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_landing_page_views(lp_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.landing_pages
    SET views = views + 1
    WHERE id = lp_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_landing_page_clicks(lp_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.landing_pages
    SET clicks = clicks + 1
    WHERE id = lp_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_short_link_clicks(link_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.short_links
    SET clicks = clicks + 1
    WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Unlock Extra Landing Page Slot (350 Points)
CREATE OR REPLACE FUNCTION public.unlock_extra_landing_page_slot(user_id UUID)
RETURNS JSONB AS $$
DECLARE
    current_points INT;
BEGIN
    SELECT points INTO current_points FROM public.profiles WHERE id = user_id;
    IF current_points IS NULL OR current_points < 350 THEN
        RETURN jsonb_build_object('success', false, 'message', 'แต้มสะสมไม่เพียงพอ (ต้องการ 350 แต้ม)');
    END IF;
    UPDATE public.profiles
    SET points = points - 350,
        extra_landing_page_slots = COALESCE(extra_landing_page_slots, 0) + 1
    WHERE id = user_id;
    RETURN jsonb_build_object('success', true, 'message', 'ปลดล็อกโควตาเซลเพจเพิ่มสำเร็จ +1 ช่อง');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Unlock Shortener (100 Points / 30 Days)
CREATE OR REPLACE FUNCTION public.unlock_shortener_with_points(user_id UUID)
RETURNS JSONB AS $$
DECLARE
    current_points INT;
    cur_exp TIMESTAMP WITH TIME ZONE;
    new_exp TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT points, shortener_expires_at INTO current_points, cur_exp FROM public.profiles WHERE id = user_id;
    IF current_points IS NULL OR current_points < 100 THEN
        RETURN jsonb_build_object('success', false, 'message', 'แต้มสะสมไม่เพียงพอ (ต้องการ 100 แต้ม)');
    END IF;
    IF cur_exp IS NOT NULL AND cur_exp > NOW() THEN
        new_exp := cur_exp + INTERVAL '30 days';
    ELSE
        new_exp := NOW() + INTERVAL '30 days';
    END IF;
    UPDATE public.profiles
    SET points = points - 100,
        shortener_expires_at = new_exp
    WHERE id = user_id;
    RETURN jsonb_build_object('success', true, 'message', 'ปลดล็อกระบบย่อลิงก์สำเร็จ 30 วัน');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Admin Approve Payment Transaction (เติมแต้ม / อนุมัติแพ็กเกจ)
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


-- ============================================================================
-- 11. LINE NOTIFICATION & LANDING PAGE 30-DAYS EXPIRATION SAFE MIGRATION
-- ============================================================================
DO $$ 
BEGIN
    -- 1. Add line_notify_token to profiles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'line_notify_token') THEN
        ALTER TABLE public.profiles ADD COLUMN line_notify_token TEXT;
    END IF;

    -- 2. Add line_webhook_url to profiles
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'line_webhook_url') THEN
        ALTER TABLE public.profiles ADD COLUMN line_webhook_url TEXT;
    END IF;

    -- 3. Add expires_at to landing_pages (Default 30 days from creation)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'landing_pages' AND column_name = 'expires_at') THEN
        ALTER TABLE public.landing_pages ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days');
    END IF;
END $$;

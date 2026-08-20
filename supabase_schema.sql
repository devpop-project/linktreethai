-- ==============================================================================
-- 🚀 COMPLETE SUPABASE SCHEMA & DATABASE SETUP
-- Project: LinkTreeThai Suite (V27) + Dedicated Ads Sales Pages + Auto Pixel Injection
-- Supabase URL: https://dkidksohprjhkcokdbja.supabase.co
-- ==============================================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES TABLE (ตารางข้อมูลผู้ใช้งานและโปรไฟล์)
-- ==============================================================================
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
    extra_landing_page_slots INT DEFAULT 0, -- โควตาเซลเพจเพิ่มเติม (350 แต้ม / 1 URL)
    hide_branding BOOLEAN DEFAULT FALSE,

    -- Tracking Pixels (FB, TikTok, Google GA4/GAds, LINE Tag)
    fb_pixel_id TEXT,
    tiktok_pixel_id TEXT,
    google_pixel_id TEXT,
    line_tag_id TEXT,

    og_title TEXT,
    og_description TEXT,
    og_image_url TEXT,

    custom_button_color TEXT DEFAULT '#1E1B4B',
    custom_button_text_color TEXT DEFAULT '#FFFFFF',
    theme_name TEXT DEFAULT 'default',
    
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

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration for existing profiles
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'fb_pixel_id') THEN
        ALTER TABLE public.profiles ADD COLUMN fb_pixel_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'tiktok_pixel_id') THEN
        ALTER TABLE public.profiles ADD COLUMN tiktok_pixel_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'google_pixel_id') THEN
        ALTER TABLE public.profiles ADD COLUMN google_pixel_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'line_tag_id') THEN
        ALTER TABLE public.profiles ADD COLUMN line_tag_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'extra_landing_page_slots') THEN
        ALTER TABLE public.profiles ADD COLUMN extra_landing_page_slots INT DEFAULT 0;
    END IF;
END $$;

-- ==============================================================================
-- 2. LINKS TABLE (ตารางลิ้งก์โซเชียลและปุ่มกด)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    url TEXT NOT NULL,
    icon TEXT DEFAULT 'website',
    logo_url TEXT,
    bg_color TEXT DEFAULT '#1E1B4B',
    text_color TEXT DEFAULT '#FFFFFF',
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    position INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 3. PRODUCTS TABLE (ตารางสินค้าและร้านค้าดิจิทัล)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
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

-- ==============================================================================
-- 4. LANDING PAGES TABLE (ตารางเซลเพจสำหรับยิงแอดโดยเฉพาะ) 🚀
-- ==============================================================================

-- Migration for landing_pages custom pixels
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'fb_pixel_id') THEN
        ALTER TABLE public.landing_pages ADD COLUMN fb_pixel_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'tiktok_pixel_id') THEN
        ALTER TABLE public.landing_pages ADD COLUMN tiktok_pixel_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'google_pixel_id') THEN
        ALTER TABLE public.landing_pages ADD COLUMN google_pixel_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'line_tag_id') THEN
        ALTER TABLE public.landing_pages ADD COLUMN line_tag_id TEXT;
    END IF;
END $$;


-- Migration for 6-section Direct Response & SEO columns in landing_pages
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'pain_headline') THEN
        ALTER TABLE public.landing_pages ADD COLUMN pain_headline TEXT DEFAULT 'คุณกำลังเจอปัญหาเหล่านี้อยู่ใช่หรือไม่?';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'pain_points') THEN
        ALTER TABLE public.landing_pages ADD COLUMN pain_points JSONB DEFAULT '[]'::JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'benefits_headline') THEN
        ALTER TABLE public.landing_pages ADD COLUMN benefits_headline TEXT DEFAULT 'ทางออกและผลลัพธ์ที่คุณจะได้รับ';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'benefits') THEN
        ALTER TABLE public.landing_pages ADD COLUMN benefits JSONB DEFAULT '[]'::JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'testimonials') THEN
        ALTER TABLE public.landing_pages ADD COLUMN testimonials JSONB DEFAULT '[]'::JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'faqs') THEN
        ALTER TABLE public.landing_pages ADD COLUMN faqs JSONB DEFAULT '[]'::JSONB;
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
END $$;


-- Migration for separate hero_image_url and video_url in landing_pages
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'hero_image_url') THEN
        ALTER TABLE public.landing_pages ADD COLUMN hero_image_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'video_url') THEN
        ALTER TABLE public.landing_pages ADD COLUMN video_url TEXT;
    END IF;
END $$;


-- Migration for full styling & background image customization in landing_pages
DO $$ 
BEGIN 
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
END $$;

CREATE TABLE IF NOT EXISTS public.landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    headline TEXT NOT NULL,
    subheadline TEXT,
    hero_media_url TEXT,
    hero_media_type TEXT DEFAULT 'image', -- 'image' | 'youtube'
    body_content TEXT,
    offer_price NUMERIC(10, 2),
    original_price NUMERIC(10, 2),
    cta_text TEXT DEFAULT 'สั่งซื้อโปรโมชั่นพิเศษนี้ทันที',
    cta_url TEXT NOT NULL,
    countdown_minutes INT DEFAULT 15,
    features JSONB DEFAULT '[]'::JSONB,
    theme_color TEXT DEFAULT '#EF4444',
    fb_pixel_id TEXT,
    tiktok_pixel_id TEXT,
    google_pixel_id TEXT,
    line_tag_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    views INT DEFAULT 0,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 5. LEADS TABLE (ตารางข้อมูลผู้ติดต่อ/ลูกค้าเป้าหมาย)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 6. SHORT LINKS TABLE (ตารางระบบย่อลิงก์ / URL Shortener)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.short_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    title TEXT,
    clicks INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==============================================================================
-- Migration for Gallery Images, Review Images & Pixel Events Tracking
-- ==============================================================================
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'gallery_images') THEN
        ALTER TABLE public.landing_pages ADD COLUMN gallery_images JSONB DEFAULT '[]'::JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'review_images') THEN
        ALTER TABLE public.landing_pages ADD COLUMN review_images JSONB DEFAULT '[]'::JSONB;
    END IF;
END $$;

-- 8. PIXEL EVENTS TABLE (ตารางบันทึกข้อมูลสถิติพิกเซลและคอนเวอร์ชัน)
CREATE TABLE IF NOT EXISTS public.pixel_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    landing_page_id UUID REFERENCES public.landing_pages(id) ON DELETE CASCADE,
    pixel_type TEXT NOT NULL, -- 'facebook' | 'tiktok' | 'google' | 'line' | 'all'
    pixel_id TEXT,
    event_name TEXT NOT NULL, -- 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Purchase' | 'Lead' | 'Contact'
    event_data JSONB DEFAULT '{}'::JSONB,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.pixel_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert pixel events" ON public.pixel_events;
CREATE POLICY "Public insert pixel events" ON public.pixel_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users view own pixel events" ON public.pixel_events;
CREATE POLICY "Users view own pixel events" ON public.pixel_events FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin()
);


-- Migration for trust badges and COD form toggle in landing_pages
DO $$ 
BEGIN 
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
END $$;


-- Migration for Tracking Pixels 30-day unlock
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'pixel_expires_at') THEN
        ALTER TABLE public.profiles ADD COLUMN pixel_expires_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- RPC for unlocking Tracking Pixels with 100 points
CREATE OR REPLACE FUNCTION public.unlock_pixels_with_points(
    target_user_id UUID,
    points_cost INT DEFAULT 100
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_pts INT;
    new_exp TIMESTAMP WITH TIME ZONE;
    curr_exp TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT points, pixel_expires_at INTO current_pts, curr_exp
    FROM public.profiles
    WHERE id = target_user_id;

    IF current_pts IS NULL OR current_pts < points_cost THEN
        RETURN jsonb_build_object('success', false, 'message', 'แต้มสะสมไม่เพียงพอ (ต้องการ 100 แต้ม)');
    END IF;

    IF curr_exp IS NOT NULL AND curr_exp > NOW() THEN
        new_exp := curr_exp + INTERVAL '30 days';
    ELSE
        new_exp := NOW() + INTERVAL '30 days';
    END IF;

    UPDATE public.profiles
    SET points = points - points_cost,
        pixel_expires_at = new_exp
    WHERE id = target_user_id;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'ปลดล็อกระบบ Tracking Pixels สำเร็จ 30 วัน!', 
        'remaining_points', current_pts - points_cost,
        'expires_at', new_exp
    );
END;
$$;


-- Migration for text_color and subtext_color customization in landing_pages
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'text_color') THEN
        ALTER TABLE public.landing_pages ADD COLUMN text_color TEXT DEFAULT '#FFFFFF';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'subtext_color') THEN
        ALTER TABLE public.landing_pages ADD COLUMN subtext_color TEXT DEFAULT '#E2E8F0';
    END IF;
END $$;


-- Migration for enable_review_album in landing_pages
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'enable_review_album') THEN
        ALTER TABLE public.landing_pages ADD COLUMN enable_review_album BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- ==============================================================================
-- 7. HELPER FUNCTION: IS_ADMIN()
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
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.short_links ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "Public profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage profiles" ON public.profiles;
CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Links
DROP POLICY IF EXISTS "Public active links viewable by everyone" ON public.links;
CREATE POLICY "Public active links viewable by everyone" ON public.links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own links" ON public.links;
CREATE POLICY "Users manage own links" ON public.links FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Products
DROP POLICY IF EXISTS "Public active products viewable by everyone" ON public.products;
CREATE POLICY "Public active products viewable by everyone" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own products" ON public.products;
CREATE POLICY "Users manage own products" ON public.products FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Landing Pages
DROP POLICY IF EXISTS "Public view active landing pages" ON public.landing_pages;
CREATE POLICY "Public view active landing pages" ON public.landing_pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own landing pages" ON public.landing_pages;
CREATE POLICY "Users manage own landing pages" ON public.landing_pages FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Leads
DROP POLICY IF EXISTS "Public insert leads" ON public.leads;
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users manage own leads" ON public.leads;
CREATE POLICY "Users manage own leads" ON public.leads FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Short Links
DROP POLICY IF EXISTS "Public view short links" ON public.short_links;
CREATE POLICY "Public view short links" ON public.short_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin and creators manage short links" ON public.short_links;
CREATE POLICY "Admin and creators manage short links" ON public.short_links FOR ALL USING (
    public.is_admin() OR auth.uid() = created_by OR auth.role() = 'authenticated'
);

-- ==============================================================================
-- 9. RPC FUNCTIONS (Stored Procedures)
-- ==============================================================================

-- 9.1 Counter Increments
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.links SET clicks = clicks + 1 WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_short_link_clicks(link_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.short_links SET clicks = clicks + 1 WHERE id = link_id;
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

-- 9.2 Unlock Extra Landing Page Slot with 350 Points 🚀
CREATE OR REPLACE FUNCTION public.unlock_landing_page_with_points(target_user_id UUID, points_cost INT DEFAULT 350)
RETURNS JSONB AS $$
DECLARE
    current_pts INT;
    current_slots INT;
BEGIN
    SELECT points, COALESCE(extra_landing_page_slots, 0) INTO current_pts, current_slots
    FROM public.profiles
    WHERE id = target_user_id;

    IF current_pts < points_cost THEN
        RETURN jsonb_build_object('success', false, 'message', 'แต้มของคุณไม่เพียงพอ (ต้องการ ' || points_cost || ' แต้ม แต่คุณมี ' || COALESCE(current_pts, 0) || ' แต้ม)');
    END IF;

    UPDATE public.profiles
    SET points = points - points_cost,
        extra_landing_page_slots = current_slots + 1
    WHERE id = target_user_id;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'ปลดล็อกโควตาเซลเพจเพิ่ม 1 URL สำเร็จ!', 
        'new_slots', current_slots + 1,
        'remaining_points', current_pts - points_cost
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9.3 Unlock Shortener with 100 Points for 30 Days
CREATE OR REPLACE FUNCTION public.unlock_shortener_with_points(target_user_id UUID, points_cost INT DEFAULT 100, duration_days INT DEFAULT 30)
RETURNS JSONB AS $$
DECLARE
    current_pts INT;
    current_exp TIMESTAMP WITH TIME ZONE;
    new_exp TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT points, shortener_expires_at INTO current_pts, current_exp
    FROM public.profiles
    WHERE id = target_user_id;

    IF current_pts < points_cost THEN
        RETURN jsonb_build_object('success', false, 'message', 'แต้มของคุณไม่เพียงพอ (ต้องการ ' || points_cost || ' แต้ม แต่คุณมี ' || COALESCE(current_pts, 0) || ' แต้ม)');
    END IF;

    IF current_exp IS NOT NULL AND current_exp > NOW() THEN
        new_exp := current_exp + (duration_days || ' days')::INTERVAL;
    ELSE
        new_exp := NOW() + (duration_days || ' days')::INTERVAL;
    END IF;

    UPDATE public.profiles
    SET points = points - points_cost,
        shortener_expires_at = new_exp
    WHERE id = target_user_id;

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'ปลดล็อกระบบย่อลิงก์สำเร็จ 30 วัน!', 
        'new_expires_at', new_exp,
        'remaining_points', current_pts - points_cost
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9.4 Admin Subscriptions
CREATE OR REPLACE FUNCTION public.admin_grant_subscription(target_user_id UUID, tier_type TEXT, duration_days INT DEFAULT 30)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
DECLARE
    new_expires TIMESTAMP WITH TIME ZONE;
BEGIN
    IF tier_type = 'free' THEN
        UPDATE public.profiles 
        SET pro_expires_at = NULL, 
            master_expires_at = NULL, 
            shortener_expires_at = NULL 
        WHERE id = target_user_id;
        RETURN NULL;
    END IF;

    new_expires := NOW() + (duration_days || ' days')::INTERVAL;
    IF tier_type = 'master' THEN
        UPDATE public.profiles SET master_expires_at = new_expires WHERE id = target_user_id;
    ELSIF tier_type = 'pro' THEN
        UPDATE public.profiles SET pro_expires_at = new_expires WHERE id = target_user_id;
    ELSIF tier_type = 'shortener' THEN
        UPDATE public.profiles SET shortener_expires_at = new_expires WHERE id = target_user_id;
    END IF;
    RETURN new_expires;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

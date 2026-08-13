-- ==============================================================================
-- 🚀 COMPLETE SUPABASE SCHEMA & DATABASE SETUP
-- Project: Linktree Pro + Digital Shop + Admin Suite + URL Shortener
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
    hide_branding BOOLEAN DEFAULT FALSE,

    og_title TEXT,
    og_description TEXT,
    og_image_url TEXT,

    custom_button_color TEXT DEFAULT '#1e293b',
    custom_button_text_color TEXT DEFAULT '#ffffff',
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

-- Ensure all columns exist in case of upgrading existing tables
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS template_id TEXT DEFAULT 'template_1';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS master_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hide_branding BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS og_image_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_button_color TEXT DEFAULT '#1e293b';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_button_text_color TEXT DEFAULT '#ffffff';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme_name TEXT DEFAULT 'default';

-- ==============================================================================
-- 2. LINKS TABLE (ตารางลิ้งก์โซเชียลและปุ่มกด)
-- ==============================================================================
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
-- 4. LEADS TABLE (ตารางข้อมูลผู้ติดต่อ/ลูกค้าเป้าหมาย)
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
-- 5. ANALYTICS EVENTS TABLE (ตารางเก็บสถิติการคลิกและเข้าชม)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    target_id TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 6. SHORT LINKS TABLE (ตารางระบบย่อลิงก์ / URL Shortener) 🚀
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
-- 7. SHORT LINK ANALYTICS TABLE (ตารางสถิติผู้เข้าชมลิงก์ย่อ)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.short_link_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_link_id UUID NOT NULL REFERENCES public.short_links(id) ON DELETE CASCADE,
    referrer TEXT,
    user_agent TEXT,
    ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- 8. HELPER FUNCTION: IS_ADMIN()
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
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.short_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.short_link_analytics ENABLE ROW LEVEL SECURITY;

-- 9.1 Profiles Policies
DROP POLICY IF EXISTS "Public profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage profiles" ON public.profiles;
CREATE POLICY "Admin manage profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- 9.2 Links Policies
DROP POLICY IF EXISTS "Public active links viewable by everyone" ON public.links;
CREATE POLICY "Public active links viewable by everyone" ON public.links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own links" ON public.links;
CREATE POLICY "Users manage own links" ON public.links FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- 9.3 Products Policies
DROP POLICY IF EXISTS "Public active products viewable by everyone" ON public.products;
CREATE POLICY "Public active products viewable by everyone" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own products" ON public.products;
CREATE POLICY "Users manage own products" ON public.products FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- 9.4 Leads Policies
DROP POLICY IF EXISTS "Public insert leads" ON public.leads;
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users manage own leads" ON public.leads;
CREATE POLICY "Users manage own leads" ON public.leads FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- 9.5 Analytics Events Policies
DROP POLICY IF EXISTS "Public insert analytics" ON public.analytics_events;
CREATE POLICY "Public insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users view own analytics" ON public.analytics_events;
CREATE POLICY "Users view own analytics" ON public.analytics_events FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- 9.6 Short Links Policies
DROP POLICY IF EXISTS "Public view short links" ON public.short_links;
CREATE POLICY "Public view short links" ON public.short_links FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin and creators manage short links" ON public.short_links;
CREATE POLICY "Admin and creators manage short links" ON public.short_links FOR ALL USING (
    public.is_admin() OR auth.uid() = created_by OR auth.role() = 'authenticated'
);

-- 9.7 Short Link Analytics Policies
DROP POLICY IF EXISTS "Public insert short link analytics" ON public.short_link_analytics;
CREATE POLICY "Public insert short link analytics" ON public.short_link_analytics FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin view short link analytics" ON public.short_link_analytics;
CREATE POLICY "Admin view short link analytics" ON public.short_link_analytics FOR SELECT USING (public.is_admin());

-- ==============================================================================
-- 10. AUTH TRIGGER (สร้าง Profile อัตโนมัติเมื่อมีการสมัครสมาชิกใหม่)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    clean_username TEXT;
    existing_count INT;
BEGIN
    clean_username := LOWER(SPLIT_PART(NEW.email, '@', 1));
    
    -- Check if username already exists
    SELECT COUNT(*) INTO existing_count FROM public.profiles WHERE username = clean_username;
    IF existing_count > 0 THEN
        clean_username := clean_username || '_' || SUBSTRING(NEW.id::TEXT, 1, 4);
    END IF;

    INSERT INTO public.profiles (id, username, full_name, avatar_url, template_id, points, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', clean_username),
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id,
        'template_1',
        0,
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    )
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        full_name = EXCLUDED.full_name;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 11. RPC STORED PROCEDURES
-- ==============================================================================

-- 11.1 นับจำนวนคลิกลิ้งก์ทั่วไป
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.links SET clicks = clicks + 1 WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11.2 นับจำนวนคลิกลิงก์ย่อตาม ID
CREATE OR REPLACE FUNCTION public.increment_short_link_clicks(link_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.short_links SET clicks = clicks + 1 WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11.3 นับจำนวนคลิกลิงก์ย่อตาม Slug
CREATE OR REPLACE FUNCTION public.increment_short_link_clicks_by_slug(slug_text TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.short_links SET clicks = clicks + 1 WHERE LOWER(slug) = LOWER(slug_text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11.4 ระบบเติมแต้ม (User / System)
CREATE OR REPLACE FUNCTION public.topup_points(target_user_id UUID, amount INT)
RETURNS INT AS $$
DECLARE
    updated_pts INT;
BEGIN
    UPDATE public.profiles 
    SET points = GREATEST(0, points + amount) 
    WHERE id = target_user_id 
    RETURNING points INTO updated_pts;
    
    RETURN updated_pts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11.5 ระบบซื้อแพ็กเกจ Pro
CREATE OR REPLACE FUNCTION public.buy_pro_subscription(target_user_id UUID, points_cost INT DEFAULT 100, duration_days INT DEFAULT 30)
RETURNS JSONB AS $$
DECLARE
    current_pts INT;
    current_expires TIMESTAMP WITH TIME ZONE;
    new_expires TIMESTAMP WITH TIME ZONE;
    updated_pts INT;
BEGIN
    SELECT points, pro_expires_at INTO current_pts, current_expires FROM public.profiles WHERE id = target_user_id;

    IF current_pts < points_cost THEN
        RETURN jsonb_build_object('success', false, 'error', 'แต้มไม่เพียงพอ');
    END IF;

    IF current_expires IS NOT NULL AND current_expires > NOW() THEN
        new_expires := current_expires + (duration_days || ' days')::INTERVAL;
    ELSE
        new_expires := NOW() + (duration_days || ' days')::INTERVAL;
    END IF;

    UPDATE public.profiles 
    SET points = points - points_cost, pro_expires_at = new_expires 
    WHERE id = target_user_id 
    RETURNING points INTO updated_pts;

    RETURN jsonb_build_object('success', true, 'remaining_points', updated_pts, 'pro_expires_at', new_expires);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11.6 ระบบซื้อแพ็กเกจ Master VIP
CREATE OR REPLACE FUNCTION public.buy_master_subscription(target_user_id UUID, points_cost INT DEFAULT 250, duration_days INT DEFAULT 30)
RETURNS JSONB AS $$
DECLARE
    current_pts INT;
    current_expires TIMESTAMP WITH TIME ZONE;
    new_expires TIMESTAMP WITH TIME ZONE;
    updated_pts INT;
BEGIN
    SELECT points, master_expires_at INTO current_pts, current_expires FROM public.profiles WHERE id = target_user_id;

    IF current_pts < points_cost THEN
        RETURN jsonb_build_object('success', false, 'error', 'แต้มไม่เพียงพอ');
    END IF;

    IF current_expires IS NOT NULL AND current_expires > NOW() THEN
        new_expires := current_expires + (duration_days || ' days')::INTERVAL;
    ELSE
        new_expires := NOW() + (duration_days || ' days')::INTERVAL;
    END IF;

    UPDATE public.profiles 
    SET points = points - points_cost, master_expires_at = new_expires 
    WHERE id = target_user_id 
    RETURNING points INTO updated_pts;

    RETURN jsonb_build_object('success', true, 'remaining_points', updated_pts, 'master_expires_at', new_expires);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11.7 Admin RPC: เพิ่มหรือลดแต้มแบบกำหนดเอง
CREATE OR REPLACE FUNCTION public.admin_add_points(target_user_id UUID, amount INT)
RETURNS INT AS $$
DECLARE
    updated_pts INT;
BEGIN
    UPDATE public.profiles
    SET points = GREATEST(0, points + amount)
    WHERE id = target_user_id
    RETURNING points INTO updated_pts;

    RETURN updated_pts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11.8 Admin RPC: มอบสิทธิ์ Pro / Master
CREATE OR REPLACE FUNCTION public.admin_grant_subscription(target_user_id UUID, tier_type TEXT, duration_days INT DEFAULT 30)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
DECLARE
    new_expires TIMESTAMP WITH TIME ZONE;
BEGIN
    new_expires := NOW() + (duration_days || ' days')::INTERVAL;

    IF tier_type = 'master' THEN
        UPDATE public.profiles SET master_expires_at = new_expires WHERE id = target_user_id;
    ELSIF tier_type = 'pro' THEN
        UPDATE public.profiles SET pro_expires_at = new_expires WHERE id = target_user_id;
    END IF;

    RETURN new_expires;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 12. STORAGE BUCKET CONFIGURATION (อัปโหลดรูปภาพ Avatar/Cover/สินค้า)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access Media" ON storage.objects;
CREATE POLICY "Public Access Media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Auth Upload Media" ON storage.objects;
CREATE POLICY "Auth Upload Media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Auth Delete Media" ON storage.objects;
CREATE POLICY "Auth Delete Media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- ==============================================================================
-- 🎉 สำเร็จ! คำสั่งสำหรับตั้งค่า User ให้เป็น Admin:
-- UPDATE public.profiles SET role = 'admin' WHERE username = 'YOUR_USERNAME';
-- ==============================================================================

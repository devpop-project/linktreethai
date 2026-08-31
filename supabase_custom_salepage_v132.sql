-- ==============================================================================
-- LinkTreeThai: Custom Salepage Builder V132 Database Migration & Schema Sync
-- Execute this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Ensure public.landing_pages table has all necessary modular columns
ALTER TABLE public.landing_pages 
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#8B5CF6',
ADD COLUMN IF NOT EXISTS bg_color TEXT DEFAULT '#0B0F17',
ADD COLUMN IF NOT EXISTS bg_image_url TEXT,
ADD COLUMN IF NOT EXISTS bg_image_opacity INT DEFAULT 85,
ADD COLUMN IF NOT EXISTS bg_image_blur INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS bg_image_mode TEXT DEFAULT 'cover',
ADD COLUMN IF NOT EXISTS inner_bg_image_url TEXT,
ADD COLUMN IF NOT EXISTS inner_bg_opacity INT DEFAULT 85,
ADD COLUMN IF NOT EXISTS inner_bg_blur INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS inner_bg_mode TEXT DEFAULT 'cover',
ADD COLUMN IF NOT EXISTS card_style TEXT DEFAULT 'glass',
ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS subtext_color TEXT DEFAULT '#E2E8F0',
ADD COLUMN IF NOT EXISTS trust_badge_1 TEXT DEFAULT 'ส่งฟรีด่วน',
ADD COLUMN IF NOT EXISTS trust_badge_2 TEXT DEFAULT 'ของแท้ 100%',
ADD COLUMN IF NOT EXISTS trust_badge_3 TEXT DEFAULT 'ชำระเงินปลอดภัย',
ADD COLUMN IF NOT EXISTS pain_headline TEXT,
ADD COLUMN IF NOT EXISTS pain_points JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS benefits_headline TEXT,
ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS testimonials JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS guarantee_text TEXT DEFAULT 'รับประกันความพึงพอใจ ของแท้ 100%',
ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS review_images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS enable_review_album BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS enable_cod_form BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS enable_promptpay_qr BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS promptpay_number TEXT,
ADD COLUMN IF NOT EXISTS promptpay_name TEXT,
ADD COLUMN IF NOT EXISTS sticky_btn1_text TEXT DEFAULT 'สั่งซื้อโปรโมชั่นด่วน',
ADD COLUMN IF NOT EXISTS sticky_btn1_url TEXT DEFAULT '#checkout',
ADD COLUMN IF NOT EXISTS sticky_btn2_text TEXT DEFAULT 'แชท LINE',
ADD COLUMN IF NOT EXISTS sticky_btn2_url TEXT DEFAULT 'https://line.me',
ADD COLUMN IF NOT EXISTS sticky_btn3_text TEXT,
ADD COLUMN IF NOT EXISTS sticky_btn3_url TEXT,
ADD COLUMN IF NOT EXISTS fb_pixel_id TEXT,
ADD COLUMN IF NOT EXISTS tiktok_pixel_id TEXT,
ADD COLUMN IF NOT EXISTS google_pixel_id TEXT,
ADD COLUMN IF NOT EXISTS line_tag_id TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS views INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicks INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Ensure RLS Policies are in place for landing_pages
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active landing pages by slug
DROP POLICY IF EXISTS "Public can view active landing pages" ON public.landing_pages;
CREATE POLICY "Public can view active landing pages" 
ON public.landing_pages 
FOR SELECT 
USING (is_active = TRUE);

-- Allow authenticated users to manage their own landing pages
DROP POLICY IF EXISTS "Users can manage own landing pages" ON public.landing_pages;
CREATE POLICY "Users can manage own landing pages" 
ON public.landing_pages 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- 3. Create function to increment page views atomically
CREATE OR REPLACE FUNCTION public.increment_landing_page_views(page_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.landing_pages
  SET views = COALESCE(views, 0) + 1
  WHERE id = page_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Storage Bucket Policies (for media and assets uploads)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('linktree-assets', 'linktree-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Public Read
DROP POLICY IF EXISTS "Media Public Read" ON storage.objects;
CREATE POLICY "Media Public Read" 
ON storage.objects 
FOR SELECT 
USING (bucket_id IN ('media', 'linktree-assets'));

-- Storage Authenticated Upload
DROP POLICY IF EXISTS "Media Authenticated Upload" ON storage.objects;
CREATE POLICY "Media Authenticated Upload" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id IN ('media', 'linktree-assets'));

-- Storage Authenticated Update/Delete
DROP POLICY IF EXISTS "Media Authenticated Update" ON storage.objects;
CREATE POLICY "Media Authenticated Update" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id IN ('media', 'linktree-assets'));

-- ==============================================================================
-- Migration Complete!
-- ==============================================================================

import { createClient } from './client';

/**
 * Uploads a local File object directly to Supabase Storage bucket 'media'
 * and returns the permanent Public URL.
 */
export const uploadFileToSupabase = async (
  file: File,
  folder: 'posts' | 'products' | 'videos' = 'posts'
): Promise<{ url: string | null; error: string | null }> => {
  try {
    const supabase = createClient();

    // 1. Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // 2. Upload file object to 'media' bucket
    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return { url: null, error: error.message };
    }

    // 3. Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    console.error('Storage upload exception:', err);
    return { url: null, error: err.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' };
  }
};

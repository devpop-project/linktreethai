export type UserTier = 'free' | 'vip' | 'master';
export type PostType = 'question' | 'discussion' | 'review' | 'news' | 'poll' | 'marketplace';

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'line' | 'shopee' | 'lazada' | 'youtube' | 'website' | 'custom';
  title: string;
  url: string;
  custom_icon_url?: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  avatar_url: string;
  cover_url?: string;
  social_links?: SocialLink[];
  points_balance: number;
  user_tier: UserTier;
  vip_expires_at?: string;
  master_expires_at?: string;
  is_verified_seller: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
}

export interface Product {
  id: string;
  post_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  condition: 'new' | 'used';
  is_available: boolean;
  images?: ProductImage[];
}

export interface PostMedia {
  id: string;
  post_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  hls_url?: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  post_type: PostType;
  likes_count: number;
  views_count: number;
  created_at: string;
  profile?: Profile;
  products?: Product[];
  media?: PostMedia[];
  comments_count?: number;
}

export interface TierPackage {
  id: string;
  name: string;
  tier: 'vip' | 'master';
  days: number;
  points_cost: number;
}

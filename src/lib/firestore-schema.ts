/**
 * Firestore schema definitions for Zariya
 */

export interface AIAsset {
  id: string;
  type: 'story' | 'hashtags' | 'image_enhancement' | 'price_suggestion';
  product_id: string;
  generated_text?: string;
  transcript?: string;
  is_edited_by_artisan: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Product {
  id: string;
  artisan_id: string;
  title: string;
  category: string;
  dimensions: string;
  price: number;
  suggested_price?: number;
  price_rationale?: string;
  craft_story_id?: string;
  short_description?: string;
  images: {
    original: string;
    enhanced?: string;
    cartoon?: string;
    quality?: {
      brightness?: number;
      blur_score?: number;
    };
  };
  tags: string[];
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  status: 'draft' | 'published' | 'sold' | 'reserved';
  created_at: string;
  updated_at: string;
}

export interface VoiceSession {
  id: string;
  artisan_id: string;
  product_id?: string;
  state: 'photos' | 'story' | 'pricing' | 'trends' | 'shipping' | 'billing' | 'review' | 'published';
  slots: {
    title?: string;
    images?: string[];
    story_text?: string;
    suggested_price?: number;
    tags?: string[];
    shipping_address?: any;
  };
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  product_id: string;
  buyer_id: string;
  price: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  payment_intent_id?: string;
  created_at: string;
  updated_at: string;
}

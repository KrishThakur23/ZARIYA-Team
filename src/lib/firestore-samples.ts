/**
 * Sample Firestore documents for Zariya
 * These show the expected structure after Task 1 implementation
 */

// Sample AI Asset document (created after story capture)
export const sampleAIAsset = {
  id: "ai_asset_1703123456789",
  type: "story",
  product_id: "product_1703123456789",
  generated_text: "I created this beautiful hand-carved wooden bowl over the course of three weeks, using reclaimed oak wood from an old barn and traditional Japanese carving techniques. The bowl represents the harmony between nature and craftsmanship, with each imperfection telling a story of the wood's journey. I wanted to create something that would bring warmth to any home and last for generations, embodying the timeless beauty of handmade artistry.",
  transcript: "I created this beautiful hand-carved wooden bowl over the course of three weeks. I used reclaimed oak wood from an old barn and traditional Japanese carving techniques. The bowl represents the harmony between nature and craftsmanship, with each imperfection telling a story of the wood's journey. I wanted to create something that would bring warmth to any home and last for generations.",
  is_edited_by_artisan: false,
  created_at: "2024-01-01T10:30:45.123Z",
  updated_at: "2024-01-01T10:30:45.123Z",
  metadata: {
    audio_duration: 45.2,
    processing_time: 2.1,
    model_used: "gemini-1.5-flash"
  }
};

// Sample Product document (after story capture step)
export const sampleProduct = {
  id: "product_1703123456789",
  artisan_id: "artisan_123",
  title: "Hand-Carved Oak Bowl",
  category: "woodworking",
  dimensions: "8\" x 6\" x 3\"",
  price: 0, // Will be set in pricing step
  craft_story_id: "ai_asset_1703123456789",
  short_description: "A beautifully crafted handmade piece that combines traditional techniques with modern appeal.",
  images: {
    original: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    enhanced: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    cartoon: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    quality: {
      brightness: 0.75,
      blur_score: 0.12
    }
  },
  tags: [], // Will be populated in trends step
  status: "draft",
  created_at: "2024-01-01T10:00:00.000Z",
  updated_at: "2024-01-01T10:30:45.123Z"
};

// Sample Voice Session document (for resume functionality)
export const sampleVoiceSession = {
  id: "session_1703123456789",
  artisan_id: "artisan_123",
  product_id: "product_1703123456789",
  state: "story", // Current step in the flow
  slots: {
    title: "Hand-Carved Oak Bowl",
    images: ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."],
    story_text: "I created this beautiful hand-carved wooden bowl...",
    suggested_price: null,
    tags: [],
    shipping_address: null
  },
  created_at: "2024-01-01T10:00:00.000Z",
  updated_at: "2024-01-01T10:30:45.123Z"
};

// API Response sample (what the /api/voice/story endpoint returns)
export const sampleStoryAPIResponse = {
  success: true,
  transcript: "I created this beautiful hand-carved wooden bowl over the course of three weeks. I used reclaimed oak wood from an old barn and traditional Japanese carving techniques. The bowl represents the harmony between nature and craftsmanship, with each imperfection telling a story of the wood's journey. I wanted to create something that would bring warmth to any home and last for generations.",
  craft_story_id: "ai_asset_1703123456789",
  craft_story: "I created this beautiful hand-carved wooden bowl over the course of three weeks, using reclaimed oak wood from an old barn and traditional Japanese carving techniques. The bowl represents the harmony between nature and craftsmanship, with each imperfection telling a story of the wood's journey. I wanted to create something that would bring warmth to any home and last for generations, embodying the timeless beauty of handmade artistry.",
  short_description: "A beautifully crafted handmade piece that combines traditional techniques with modern appeal.",
  ai_asset: {
    id: "ai_asset_1703123456789",
    type: "story",
    product_id: "product_1703123456789",
    generated_text: "I created this beautiful hand-carved wooden bowl over the course of three weeks, using reclaimed oak wood from an old barn and traditional Japanese carving techniques. The bowl represents the harmony between nature and craftsmanship, with each imperfection telling a story of the wood's journey. I wanted to create something that would bring warmth to any home and last for generations, embodying the timeless beauty of handmade artistry.",
    transcript: "I created this beautiful hand-carved wooden bowl over the course of three weeks. I used reclaimed oak wood from an old barn and traditional Japanese carving techniques. The bowl represents the harmony between nature and craftsmanship, with each imperfection telling a story of the wood's journey. I wanted to create something that would bring warmth to any home and last for generations.",
    is_edited_by_artisan: false,
    created_at: "2024-01-01T10:30:45.123Z",
    updated_at: "2024-01-01T10:30:45.123Z"
  }
};

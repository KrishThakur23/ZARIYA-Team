'use client';

import ProductPreview from '@/components/product/ProductPreview';

// Demo data matching the tea pot example
const demoProduct = {
  title: "Hand-Carved Teapot",
  category: "Ceramics",
  dimensions: "8\" x 6\" x 5\"",
  price: 85.00,
  story: "This exquisite hand-carved teapot was crafted with heart and beauty of East India, taught by my grandmother. Each curve and detail tells a story of tradition passed down through generations. The intricate floral patterns represent the harmony between nature and craftsmanship, while the warm terracotta finish brings warmth to any home. This piece embodies the soul of traditional Indian pottery, where every imperfection adds character and authenticity.",
  description: "A beautiful hand-carved teapot representing East Indian craftsmanship",
  transcript: "I created this beautiful hand-carved teapot over the course of three weeks. I used traditional East Indian techniques that were taught to me by my grandmother. The teapot represents the beauty and heart of our cultural heritage. Each detail was carefully crafted to tell a story of dedication and love for the art of pottery.",
  tags: ["handmade", "ceramics", "traditional", "east-indian", "teapot", "artisan", "cultural-heritage"],
  images: {
    original: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&crop=center",
    enhanced: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&crop=center",
    cartoon: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&crop=center"
  },
  suggestedPrice: 95.00,
  priceRationale: "Based on the intricate hand-carving, traditional techniques, and cultural significance, this piece commands a premium price. Similar handcrafted teapots from established artisans range from $80-120. The time investment (3 weeks) and skill level justify the higher end of this range.",
  artisanName: "Priya",
  location: "Mumbai, India",
  shippingEta: "5-7 days"
};

export default function PreviewPage() {
  const handlePublish = () => {
    console.log('Publishing product...');
    // Simulate publishing
    setTimeout(() => {
      alert('Product published successfully!');
    }, 2000);
  };

  const handleAddToCart = () => {
    console.log('Adding to cart...');
    alert('Added to cart!');
  };

  const handleEdit = () => {
    console.log('Editing product...');
  };

  const handleShare = () => {
    console.log('Sharing product...');
    if (navigator.share) {
      navigator.share({
        title: demoProduct.title,
        text: demoProduct.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleReport = () => {
    console.log('Reporting product...');
  };

  const handleFavorite = () => {
    console.log('Toggling favorite...');
  };

  const handlePriceChange = (newPrice: number) => {
    console.log('Price changed to:', newPrice);
    demoProduct.price = newPrice;
  };

  const handleStoryEdit = (newStory: string) => {
    console.log('Story edited:', newStory);
    demoProduct.story = newStory;
  };

  const handleTagClick = (tag: string) => {
    console.log('Tag clicked:', tag);
  };

  const handleCategoryClick = (category: string) => {
    console.log('Category clicked:', category);
  };

  return (
    <ProductPreview
      product={demoProduct}
      userType="artisan"
      onPublish={handlePublish}
      onAddToCart={handleAddToCart}
      onEdit={handleEdit}
      onShare={handleShare}
      onReport={handleReport}
      onFavorite={handleFavorite}
      onPriceChange={handlePriceChange}
      onStoryEdit={handleStoryEdit}
      onTagClick={handleTagClick}
      onCategoryClick={handleCategoryClick}
    />
  );
}

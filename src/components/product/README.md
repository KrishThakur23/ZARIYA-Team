# Product Preview Components

A high-end, responsive product preview system built with React, Tailwind CSS, and Framer Motion. Designed for gallery-quality presentation of artisan products.

## Components

### ProductPreview (Main Component)
The main component that orchestrates all product display elements.

**Props:**
```typescript
interface ProductPreviewProps {
  product: ProductData;
  userType?: 'artisan' | 'buyer';
  onPublish?: () => void;
  onAddToCart?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onFavorite?: () => void;
  onPriceChange?: (newPrice: number) => void;
  onStoryEdit?: (newStory: string) => void;
  onTagClick?: (tag: string) => void;
  onCategoryClick?: (category: string) => void;
}
```

### HeroImage
Large image gallery with thumbnail navigation and lightbox modal.

**Features:**
- Responsive aspect-square display
- Thumbnail gallery with hover effects
- Modal lightbox with navigation arrows
- Smooth transitions and animations

### PriceCard
Interactive price display with AI suggestions and inline editing.

**Features:**
- Large, prominent price display
- AI suggestion rationale with expand/collapse
- Inline price editing with validation
- Price range slider for suggestions

### StoryCard
Collapsible story display with editing capabilities.

**Features:**
- "Read more" expansion for long stories
- Inline editing with transcript/generated tabs
- Voice recording indicators
- Story statistics (word count, read time)

### MetaBadges
Authentication and product metadata display.

**Features:**
- Verification status badges (Authenticated, Handmade, Heritage)
- Product details (Shipping, Location, Artisan)
- Gallery ready indicator

### TagList
Interactive tag and category display.

**Features:**
- Clickable category pill
- Tag cloud with hover effects
- Add new tag functionality

### StickyActions
Fixed bottom action bar with primary and secondary CTAs.

**Features:**
- Responsive layout (desktop/mobile)
- Primary action (Publish/Add to Cart)
- Secondary actions (Edit, Share, Favorite, Report)
- Voice assistant indicator (animated waveform)

## Usage

```tsx
import ProductPreview from '@/components/product/ProductPreview';

const product = {
  title: "Hand-Carved Teapot",
  category: "Ceramics",
  dimensions: "8\" x 6\" x 5\"",
  price: 85.00,
  story: "This exquisite hand-carved teapot...",
  tags: ["handmade", "ceramics", "traditional"],
  images: {
    original: "url-to-original-image",
    enhanced: "url-to-enhanced-image",
    cartoon: "url-to-cartoon-image"
  }
};

<ProductPreview
  product={product}
  userType="artisan"
  onPublish={() => console.log('Publishing...')}
  onPriceChange={(newPrice) => setPrice(newPrice)}
/>
```

## API Endpoints

The components expect these endpoints to be available:

### Image Enhancement
```
POST /api/enhance-image
{
  "imageUrl": "string",
  "enhancementType": "enhance" | "cartoon"
}
```

### Price Suggestion
```
POST /api/price/suggest
{
  "title": "string",
  "category": "string",
  "dimensions": "string",
  "timeSpent": "number",
  "material": "string",
  "complexity": "string"
}
```

### Publish Product
```
POST /api/product/publish
{
  "title": "string",
  "category": "string",
  "price": "number",
  "story": "string",
  "images": "object",
  "tags": "string[]"
}
```

## Styling

The components use a warm, gallery-inspired color palette:
- Primary: Amber/Orange gradients
- Secondary: Warm grays and whites
- Accent: Deep charcoal for contrast
- Typography: Serif fonts for headings, sans-serif for body

## Accessibility

- Semantic HTML structure
- ARIA labels and live regions
- Keyboard navigation support
- High contrast ratios (4.5:1+)
- Screen reader friendly

## Performance

- Lazy loading for images
- Optimized animations with Framer Motion
- Responsive image sizing
- Efficient re-renders with React optimization

## Demo

Visit `/preview` to see the components in action with sample data.

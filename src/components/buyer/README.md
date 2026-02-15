# Buyer Components Documentation

## CategoryPath Component

### Overview
The `CategoryPath` component replaces the grid-based category layout with a beautiful curved snake-like path, inspired by Duolingo's level progression design. Categories are displayed as circular nodes along a curved path that alternates left and right for visual rhythm.

### Features
- **Curved Path UI**: Vertical scrollable path with smooth SVG curves
- **Circular Nodes**: Category cards positioned alternately left/right of the curve
- **Interactive**: Tap nodes to open subcategories or filtered product views
- **Visual Feedback**: Hover effects, selection glow, and smooth animations
- **Progress Tracking**: Completion badges and level indicators
- **Mobile-First**: Touch-friendly with 44px+ touch targets
- **Accessibility**: ARIA labels and good contrast ratios

### Props
```typescript
interface CategoryPathProps {
  onCategoryClick: (category: CategoryNode) => void;
}
```

### CategoryNode Interface
```typescript
interface CategoryNode {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  level: number;
  isLocked: boolean;
  isCompleted: boolean;
  description: string;
  artisanCount: number;
  productCount: number;
  position: 'left' | 'right';
}
```

### Usage Example
```tsx
import CategoryPath from '@/components/buyer/CategoryPath';

const handleCategoryClick = (category: CategoryNode) => {
  console.log('Category clicked:', category);
  // Navigate to category products or subcategories
};

<CategoryPath onCategoryClick={handleCategoryClick} />
```

### Integration Points
- **Navigation**: Calls `onCategoryClick` when a category node is tapped
- **Backend**: Uses existing category/product data structure
- **Routing**: Integrates with existing SwipeDeck filtering logic
- **State**: Maintains selected category state for visual feedback

### Styling
- **Background**: Warm gradient (cream → light yellow)
- **Curve**: Subtle amber stroke with dashed pattern
- **Nodes**: Circular cards with shadows and hover effects
- **Typography**: Serif titles, sans-serif body text
- **Colors**: Category-specific gradients with amber accents

### Performance
- **Lazy Loading**: Category icons load on demand
- **Smooth Animations**: Framer Motion for 60fps animations
- **Optimized SVG**: Efficient curved path rendering
- **Touch Targets**: 44px+ for mobile accessibility

### Accessibility
- **Touch Targets**: Minimum 44px touch area
- **ARIA Labels**: Screen reader support
- **Contrast**: 4.5:1+ contrast ratios
- **Keyboard**: Focus states for navigation

### Demo Route
- **Main**: `http://localhost:3001/buyer` (Categories tab)
- **Demo**: `http://localhost:3001/buyer/demo` (Categories tab)

### Categories Included
1. Home Decor
2. Traditional Clothing
3. Footwear
4. Kitchen & Teapot
5. Assorted Craft
6. Bead Craft
7. Block Printing
8. Marble & Stone
9. Jewelry Craft
10. Leather Craft
11. Metal Craft
12. Needlework & Embroidery
13. Painting & Art
14. Rug Weaving
15. Tie & Dye
16. Wood Craft
17. Wool Weaving (locked)

### Technical Details
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **SVG**: Custom curved path generation
- **Responsive**: Mobile-first design
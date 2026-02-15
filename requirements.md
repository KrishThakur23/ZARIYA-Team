# Zariya - Requirements Document

## 1. PROJECT OVERVIEW

### 1.1 Project Name
**Zariya** - Voice-First AI-Powered Artisan Marketplace

### 1.2 Purpose
Zariya is a revolutionary marketplace platform that bridges the gap between traditional artisans and modern buyers by removing digital literacy barriers. The platform enables artisans to list their handcrafted products using conversational voice guidance instead of complex forms, while providing buyers with an engaging, swipe-based discovery experience.

### 1.3 Target Users

#### Primary Users
- **Artisans (Sellers)**: Traditional craftspeople with varying levels of digital literacy who create handmade products
  - Pottery makers, woodworkers, jewelry artisans, textile weavers, painters, and other craft specialists
  - Often have limited English proficiency and prefer regional languages
  - May have limited experience with e-commerce platforms

- **Buyers (Collectors)**: Modern consumers seeking authentic, handcrafted products
  - Appreciate cultural significance and stories behind products
  - Value unique, one-of-a-kind items over mass-produced goods
  - Interested in supporting traditional artisans directly

### 1.4 Core Value Proposition
- **For Artisans**: Democratizes access to digital marketplaces through voice-first interfaces
- **For Buyers**: Provides curated discovery of authentic handcrafted products with rich storytelling
- **For the Ecosystem**: Preserves traditional crafts while connecting them to modern commerce

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 User Authentication & Onboarding

#### 2.1.1 Authentication
- **Google OAuth Integration**: Single sign-on using Google accounts
- **Session Management**: Persistent user sessions across visits
- **User Profile Storage**: Basic user information stored locally (demo mode)

#### 2.1.2 Language Selection
- **Supported Languages**: 9 Indian languages
  - Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi
  - English as default/fallback language
- **Language Persistence**: User's language preference saved across sessions
- **UI Localization**: Interface elements translated to selected language
- **Voice Support**: Text-to-speech and speech-to-text in selected language

#### 2.1.3 Role Selection
- **Dual Role System**: Users choose between Artisan or Buyer role
- **Role Switching**: Ability to switch roles later (future enhancement)
- **Role-Specific Onboarding**: Different onboarding flows for each role
- **Visual Role Cards**: Engaging UI with icons and descriptions for each role

### 2.2 Artisan Product Listing Flow

#### 2.2.1 Voice-Guided Tutorial
- **Onboarding Video/Reel**: Short tutorial explaining the listing process
- **Step-by-Step Voice Guidance**: AI assistant provides contextual instructions
- **Progress Indicators**: Visual feedback showing current step and completion status
- **Multi-Step Wizard**: Photos → Details → Story → Pricing → Shipping → Billing → Review

#### 2.2.2 Photo Capture System
- **Camera Integration**: Direct camera access for real-time photo capture
- **Upload Alternative**: File upload option for existing photos
- **Image Validation**: 
  - File type checking (JPG, PNG, etc.)
  - File size limit (10MB maximum)
  - Aspect ratio guidance
- **Real-Time Preview**: Live camera feed with capture button
- **Voice Instructions**: Contextual guidance for optimal photo composition
  - "Position your item in the center"
  - "Get the lighting right. Avoid harsh shadows"
  - "Hold it steady..."
  - "A little closer, please. Fill the frame"

#### 2.2.3 AI-Powered Image Enhancement
- **Automatic Enhancement**: AI improves image quality (brightness, contrast, sharpness)
- **Cartoon/Artistic Style**: Generates stylized version of product image
- **Fallback Processing**: Client-side canvas-based enhancement if AI unavailable
- **Three Image Variants**:
  - Original captured image
  - AI-enhanced version
  - Artistic/cartoon style version
- **Image Selection**: Artisan can choose which version to use as primary

#### 2.2.4 Product Details Form
- **Required Fields**:
  - Title (minimum 3 characters)
  - Category (dropdown selection)
  - Dimensions (text input with format guidance)
- **Optional Fields**:
  - Description (auto-generated or manual)
  - Story (voice-recorded or typed)
  - Price (can be AI-suggested)
- **Category Options**:
  - Pottery, Woodworking, Jewelry, Textiles, Painting, Ceramics, Glasswork, Other
- **Form Validation**: Real-time validation with error messages
- **AI Enhancement Button**: "Enhance with AI" to auto-generate descriptions

#### 2.2.5 Voice Story Recording
- **Browser Speech API**: Web Speech API for voice transcription
- **Recording Interface**:
  - Microphone button to start/stop recording
  - Visual feedback during recording (waveform/animation)
  - Real-time transcription display
- **Story Processing**:
  - Transcript sent to AI for enhancement
  - AI generates polished craft story (2-3 paragraphs)
  - AI generates short marketing description (1-2 sentences)
- **Manual Override**: Artisan can edit AI-generated story
- **Language Support**: Transcription in artisan's selected language

#### 2.2.6 AI-Powered Product Details Generation
- **Input Data**: Title, category, dimensions, price, story
- **AI Outputs**:
  - Detailed product description
  - Suggested price with rationale
  - Craft story highlighting artisan's process
- **Gemini Integration**: Uses Google Gemini 1.5 Flash model
- **Fallback Handling**: Graceful degradation if AI service unavailable

#### 2.2.7 Pricing Suggestions
- **AI Price Analysis**: Suggests price based on:
  - Product category
  - Dimensions
  - Materials mentioned in story
  - Complexity of craftsmanship
- **Manual Override**: Artisan can accept or modify suggested price
- **Price Display**: Shows both suggested and final price

#### 2.2.8 Product Preview & Publishing
- **Preview Mode**: Full product card preview before publishing
- **Edit Capability**: Return to any step to make changes
- **Publish Action**: Saves product to localStorage (demo) or Firestore (production)
- **Success Feedback**: Confirmation message and redirect to buyer marketplace

### 2.3 Buyer Discovery Flow

#### 2.3.1 Home Feed
- **Product Grid**: Responsive grid layout of product cards
- **Product Information Display**:
  - Product image (enhanced version)
  - Title and artisan name
  - Price and location
  - Rating (if available)
- **Infinite Scroll**: Load more products as user scrolls
- **Filter Options**: Category, price range, location (future)
- **Search Functionality**: Text search for products (future)

#### 2.3.2 Swipe-Based Discovery (Tinder-Style)
- **Card Stack Interface**: Layered product cards with depth effect
- **Swipe Gestures**:
  - **Swipe Right**: Add to cart (green indicator)
  - **Swipe Left**: Dismiss/Not interested (red indicator)
  - **Swipe Up**: Add to wishlist (yellow indicator)
  - **Long Press**: Appreciate artist (pink heart)
- **Visual Feedback**:
  - Direction indicators during swipe
  - Animated overlays showing action
  - Smooth card transitions
- **Action Buttons**: Alternative to swiping with tap buttons
  - Dismiss (X icon)
  - Appreciate (Heart icon)
  - Wishlist (Star icon)
  - Add to Cart (Shopping cart icon)
- **Undo Functionality**: Toast notification with undo button (5-second window)
- **Product Tap**: Tap card to view full product details

#### 2.3.3 Category Navigation (Duolingo-Style Path)
- **Visual Journey Path**: Curved, scrollable path connecting categories
- **17 Craft Categories**:
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
  17. Wool Weaving
- **Category Nodes**:
  - Unique icon for each category
  - Level number badge
  - Completion status indicator
  - Trending badge for popular categories
  - Lock icon for locked categories (future gamification)
- **Category Information**:
  - Category name and description
  - Number of artisans
  - Number of products
- **Progress Tracking**:
  - Current step indicator
  - Completion statistics
  - Total categories explored

#### 2.3.4 Product Detail Pages
- **Hero Image**: Large product image with carousel for multiple images
- **Product Information**:
  - Title, artisan name, location
  - Price and rating
  - Dimensions and category
  - Full craft story
  - Short description
- **Meta Badges**: Visual indicators for product attributes
- **Tag List**: Relevant tags/keywords for the product
- **Sticky Action Bar**: Fixed bottom bar with:
  - Add to Cart button
  - Add to Wishlist button
  - Share button (future)
- **Artisan Profile Link**: Navigate to artisan's other products (future)

#### 2.3.5 Wishlist Functionality
- **Add to Wishlist**: Save products for later viewing
- **Wishlist Page**: Dedicated page showing all saved products
- **Remove from Wishlist**: Easy removal of items
- **Wishlist Persistence**: Saved in localStorage (demo) or Firestore (production)
- **Wishlist Counter**: Badge showing number of items

#### 2.3.6 Shopping Cart
- **Add to Cart**: Add products with quantity selection
- **Cart Page**: View all cart items with:
  - Product thumbnail and details
  - Quantity adjustment
  - Remove item option
  - Subtotal calculation
- **Cart Persistence**: Saved across sessions
- **Cart Counter**: Badge showing number of items
- **Checkout Flow**: Proceed to payment (future integration)

#### 2.3.7 Bottom Navigation
- **Home Tab**: Main feed/discovery
- **Discover Tab**: Swipe deck interface
- **Categories Tab**: Category path navigation
- **Profile Tab**: User profile and settings
- **Persistent Navigation**: Fixed bottom bar on mobile
- **Active State Indicators**: Highlight current tab

---

## 3. TECHNICAL REQUIREMENTS

### 3.1 Frontend Framework & Architecture

#### 3.1.1 Core Technologies
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5.x
- **React Version**: 18.3.1
- **Build Tool**: Turbopack (Next.js dev mode)
- **Package Manager**: npm

#### 3.1.2 Styling & UI
- **CSS Framework**: Tailwind CSS 3.4.1
- **Component Library**: Radix UI primitives
  - Accordion, Alert Dialog, Avatar, Badge, Button, Calendar, Card, Carousel, Checkbox, Collapsible, Dialog, Dropdown Menu, Form, Input, Label, Menubar, Popover, Progress, Radio Group, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Switch, Table, Tabs, Textarea, Toast, Tooltip
- **Animation Library**: Framer Motion 12.23.16
- **Icons**: Lucide React 0.475.0
- **Utility Functions**: clsx, tailwind-merge, class-variance-authority

#### 3.1.3 State Management
- **React Hooks**: useState, useEffect, useRef, useContext, useTransition
- **Context API**: AssistantProvider for voice assistant state
- **Form Management**: React Hook Form 7.54.2 with Zod validation
- **Local Storage**: Demo mode data persistence
- **Custom Hooks**: 
  - useToast for notifications
  - useIsMobile for responsive detection

#### 3.1.4 Routing & Navigation
- **App Router**: Next.js 15 App Router architecture
- **File-Based Routing**: Automatic route generation
- **Dynamic Routes**: Product detail pages with [id] parameter
- **Nested Layouts**: Shared layouts for artisan and buyer sections
- **Client Components**: 'use client' directive for interactive components
- **Server Actions**: 'use server' for backend operations

### 3.2 AI & Voice Services

#### 3.2.1 AI Integration
- **AI Framework**: Genkit 1.14.1 (@genkit-ai/googleai, @genkit-ai/next)
- **AI Model**: Google Gemini 1.5 Flash
- **AI Flows**:
  - `generateProductDetails`: Product description, price suggestion, craft story
  - `textToSpeech`: Convert text to audio for voice assistant
  - `enhanceAndCartoonizeImage`: Image enhancement and artistic styling
- **Prompt Engineering**: Structured prompts with Zod schemas
- **Error Handling**: Graceful fallbacks when AI services unavailable

#### 3.2.2 Voice Services
- **Speech-to-Text**: Browser Web Speech API
  - Real-time transcription
  - Language-specific recognition
  - Continuous listening mode
- **Text-to-Speech**: 
  - Primary: Browser speechSynthesis API
  - Fallback: AI-generated audio via Genkit
  - Configurable rate, pitch, volume
  - Mute/unmute controls
- **Voice Assistant**:
  - Contextual instructions per step
  - Typing animation for text display
  - Audio playback with retry mechanism
  - Auto-enable after user interaction

#### 3.2.3 Image Processing
- **Client-Side Processing**: Canvas API for image enhancement
  - Brightness adjustment
  - Contrast enhancement
  - Sharpness filters
  - Cartoon effect generation
- **AI Enhancement**: Gemini-based image improvement
- **Image Formats**: Support for JPG, PNG, GIF, AVIF
- **Image Optimization**: Next.js Image component with remote patterns

### 3.3 Data Management

#### 3.3.1 Data Storage (Demo Mode)
- **localStorage**: Client-side persistence for demo
  - Products: `zariya_products` key
  - User preferences: Language, role selection
  - Cart and wishlist data
- **Data Structure**: JSON serialization
- **Data Validation**: Zod schemas for type safety

#### 3.3.2 Firestore Schema (Production Ready)
- **Collections**:
  - `products`: Product listings
  - `ai_assets`: AI-generated content (stories, descriptions, images)
  - `voice_sessions`: Voice interaction state management
  - `orders`: Purchase transactions
  - `users`: User profiles and preferences
- **Schema Definitions**: TypeScript interfaces in `firestore-schema.ts`
- **Relationships**: Product → AI Assets (one-to-many)

#### 3.3.3 API Routes
- **Voice Story API**: `/api/voice/story`
  - POST endpoint for story transcription and enhancement
  - Input: productId, transcript, audioData, language
  - Output: craft_story, short_description, ai_asset
- **Price Suggestion API**: `/api/price/suggest`
  - POST endpoint for AI price recommendations
  - Input: product details
  - Output: suggested price and rationale

### 3.4 Development & Build Tools

#### 3.4.1 Development Environment
- **Dev Server**: `npm run dev` with Turbopack
- **Genkit Dev**: `npm run genkit:dev` for AI flow testing
- **Type Checking**: `npm run typecheck` (TypeScript compiler)
- **Linting**: `npm run lint` (ESLint with Next.js config)
- **Build**: `npm run build` for production
- **Start**: `npm run start` for production server

#### 3.4.2 Testing & Quality Assurance
- **Storybook**: Component development and testing
  - `npm run storybook` - Dev server on port 6006
  - `npm run build-storybook` - Static build
- **Vitest**: Unit and component testing (configured)
- **Playwright**: Browser testing (configured)
- **Accessibility Testing**: Storybook a11y addon

#### 3.4.3 Configuration Files
- **next.config.ts**: Next.js configuration
  - TypeScript and ESLint error ignoring (for rapid development)
  - Image remote patterns (placehold.co, unsplash, picsum)
  - Dev indicators for cloud workstations
- **tailwind.config.js**: Tailwind CSS customization
- **tsconfig.json**: TypeScript compiler options
- **components.json**: shadcn/ui component configuration

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance

#### 4.1.1 Load Time
- **Initial Page Load**: < 3 seconds on 3G connection
- **Time to Interactive**: < 5 seconds
- **Image Loading**: Progressive loading with placeholders
- **Code Splitting**: Automatic route-based splitting via Next.js

#### 4.1.2 Animation Performance
- **Frame Rate**: 60fps for all animations
- **Smooth Transitions**: Hardware-accelerated CSS transforms
- **Framer Motion**: Optimized animation library
- **Reduced Motion**: Respect user's prefers-reduced-motion setting

#### 4.1.3 Resource Optimization
- **Image Optimization**: Next.js Image component with automatic optimization
- **Bundle Size**: Code splitting and tree shaking
- **Lazy Loading**: Components and images loaded on demand
- **Caching**: Browser caching for static assets

### 4.2 Responsive Design

#### 4.2.1 Mobile-First Approach
- **Primary Target**: Mobile devices (smartphones)
- **Breakpoints**: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Touch Optimization**: Large touch targets (minimum 44x44px)
- **Gesture Support**: Swipe, tap, long-press interactions

#### 4.2.2 Device Compatibility
- **Low-End Android**: Optimized for budget smartphones
- **iOS Support**: Safari and Chrome on iOS
- **Tablet Support**: Responsive layouts for larger screens
- **Desktop Support**: Full functionality on desktop browsers

#### 4.2.3 Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Progressive Enhancement**: Core functionality without JavaScript
- **Fallback Support**: Graceful degradation for older browsers

### 4.3 Accessibility

#### 4.3.1 WCAG Compliance
- **Target Level**: WCAG 2.1 Level AA (aspirational)
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Focus Management**: Visible focus indicators

#### 4.3.2 Inclusive Design
- **Color Contrast**: Minimum 4.5:1 for text
- **Text Sizing**: Responsive text that scales with user preferences
- **Alternative Text**: Descriptive alt text for all images
- **Error Messages**: Clear, actionable error descriptions

#### 4.3.3 Voice Accessibility
- **Voice-First Design**: Primary interaction method for artisans
- **Visual Feedback**: Text display of voice transcriptions
- **Mute Controls**: Option to disable voice output
- **Manual Alternatives**: Text input as fallback for voice

### 4.4 Internationalization (i18n)

#### 4.4.1 Language Support
- **9 Indian Languages**: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi
- **English**: Default and fallback language
- **Language Switching**: Easy language selection at any time
- **RTL Support**: Prepared for right-to-left languages (future)

#### 4.4.2 Localization
- **UI Translation**: All interface elements translated
- **Voice Support**: TTS and STT in user's language
- **Currency**: INR (₹) as primary currency
- **Date/Time**: Localized formatting
- **Number Formatting**: Locale-specific number display

### 4.5 Security

#### 4.5.1 Authentication Security
- **OAuth 2.0**: Secure Google authentication
- **Session Management**: Secure session tokens
- **HTTPS Only**: All communications over HTTPS
- **CSRF Protection**: Built-in Next.js CSRF protection

#### 4.5.2 Data Security
- **Input Validation**: Zod schemas for all user inputs
- **XSS Prevention**: React's built-in XSS protection
- **File Upload Security**: File type and size validation
- **API Security**: Rate limiting and authentication (production)

#### 4.5.3 Privacy
- **Data Minimization**: Collect only necessary data
- **User Consent**: Clear consent for data collection
- **Data Retention**: Defined retention policies
- **GDPR Compliance**: Privacy-first design (future)

### 4.6 Reliability

#### 4.6.1 Error Handling
- **Graceful Degradation**: Fallbacks for failed services
- **User-Friendly Errors**: Clear error messages
- **Retry Mechanisms**: Automatic retry for transient failures
- **Error Logging**: Console logging for debugging

#### 4.6.2 Offline Support
- **Progressive Web App**: PWA capabilities (future)
- **Offline Detection**: Notify users of connectivity issues
- **Local Storage**: Cache data for offline access
- **Service Workers**: Background sync (future)

#### 4.6.3 Monitoring
- **Error Tracking**: Console error monitoring
- **Performance Monitoring**: Core Web Vitals tracking (future)
- **User Analytics**: Usage patterns and behavior (future)

---

## 5. FUTURE REQUIREMENTS (AWS Migration)

### 5.1 AWS Service Integration

#### 5.1.1 AI & ML Services
- **Amazon Polly**: 
  - Neural TTS for natural voice output
  - Support for 9 Indian languages
  - SSML support for prosody control
  - Voice customization per language
- **Amazon Transcribe**:
  - Real-time speech-to-text
  - Custom vocabulary for craft terminology
  - Language identification
  - Speaker diarization for multi-speaker scenarios
- **Amazon Bedrock (Claude)**:
  - Advanced product description generation
  - Story enhancement and editing
  - Conversational AI for voice assistant
  - Multi-turn dialogue management
- **Amazon Rekognition**:
  - Image quality assessment
  - Object and scene detection
  - Text detection in images
  - Content moderation

#### 5.1.2 Storage Services
- **Amazon S3**:
  - Product image storage
  - AI-generated asset storage
  - Static asset hosting
  - CloudFront CDN integration
  - Lifecycle policies for cost optimization
- **S3 Intelligent-Tiering**: Automatic cost optimization
- **S3 Transfer Acceleration**: Faster uploads from India

#### 5.1.3 Database Services
- **Amazon DynamoDB**:
  - Products table with GSI for category/price queries
  - AI Assets table for generated content
  - Voice Sessions table for state management
  - Orders table for transactions
  - Users table for profiles
  - Point-in-time recovery enabled
  - Auto-scaling for read/write capacity
- **DynamoDB Streams**: Real-time data processing triggers
- **DAX (DynamoDB Accelerator)**: Caching layer for read-heavy workloads

#### 5.1.4 Authentication & Authorization
- **Amazon Cognito**:
  - User pools for authentication
  - Social identity providers (Google, Facebook)
  - Multi-factor authentication (MFA)
  - User attribute management
  - Custom authentication flows
  - JWT token management
- **Cognito Identity Pools**: Federated identities for AWS service access

#### 5.1.5 API & Compute
- **AWS Lambda**:
  - Serverless API endpoints
  - Image processing functions
  - AI workflow orchestration
  - Background job processing
- **Amazon API Gateway**:
  - RESTful API management
  - Request throttling and quotas
  - API key management
  - CORS configuration
- **AWS Step Functions**: Complex workflow orchestration

#### 5.1.6 Payment Processing
- **AWS Payment Cryptography**: Secure payment data handling
- **Integration with Payment Gateways**:
  - Razorpay for Indian market
  - Stripe for international transactions
  - UPI integration for local payments

#### 5.1.7 Monitoring & Operations
- **Amazon CloudWatch**:
  - Application logs
  - Custom metrics
  - Alarms and notifications
  - Dashboard for monitoring
- **AWS X-Ray**: Distributed tracing for performance analysis
- **AWS CloudTrail**: Audit logging for compliance

#### 5.1.8 Content Delivery
- **Amazon CloudFront**:
  - Global CDN for static assets
  - Edge caching for images
  - Custom domain support
  - SSL/TLS certificates
- **Lambda@Edge**: Edge computing for personalization

### 5.2 Migration Strategy

#### 5.2.1 Phase 1: Infrastructure Setup
- Set up AWS account and IAM roles
- Configure VPC and security groups
- Set up S3 buckets with proper policies
- Configure CloudFront distributions

#### 5.2.2 Phase 2: Data Migration
- Migrate localStorage data to DynamoDB
- Upload existing images to S3
- Set up database indexes and GSIs
- Implement data backup strategies

#### 5.2.3 Phase 3: Service Integration
- Replace Genkit with Bedrock for AI
- Integrate Polly for TTS
- Integrate Transcribe for STT
- Implement Rekognition for image analysis

#### 5.2.4 Phase 4: Authentication Migration
- Set up Cognito user pools
- Migrate existing users
- Implement OAuth flows
- Configure MFA

#### 5.2.5 Phase 5: API Migration
- Deploy Lambda functions
- Configure API Gateway
- Implement rate limiting
- Set up monitoring and alarms

#### 5.2.6 Phase 6: Testing & Optimization
- Load testing with realistic traffic
- Performance optimization
- Cost optimization
- Security audit

---

## 6. USER STORIES

### 6.1 Artisan User Stories

#### 6.1.1 Product Listing
- **US-A01**: As an artisan, I want to list my product using voice commands so I don't need to type complex forms
- **US-A02**: As an artisan, I want to capture photos directly from my phone camera so I can quickly add product images
- **US-A03**: As an artisan, I want AI to enhance my product photos so they look professional without editing skills
- **US-A04**: As an artisan, I want to record my product story in my native language so I can express myself naturally
- **US-A05**: As an artisan, I want AI to suggest a fair price for my product so I can price competitively
- **US-A06**: As an artisan, I want to preview my product listing before publishing so I can ensure everything looks correct

#### 6.1.2 Voice Interaction
- **US-A07**: As an artisan with limited digital literacy, I want voice guidance through each step so I don't get confused
- **US-A08**: As an artisan, I want to hear instructions in my native language so I can understand them clearly
- **US-A09**: As an artisan, I want to mute the voice assistant if needed so I can work in quiet environments
- **US-A10**: As an artisan, I want visual feedback of my voice transcription so I can verify what was captured

#### 6.1.3 Product Management
- **US-A11**: As an artisan, I want to edit my product details after publishing so I can update information
- **US-A12**: As an artisan, I want to see how many people viewed my products so I can track interest
- **US-A13**: As an artisan, I want to mark products as sold so buyers know availability
- **US-A14**: As an artisan, I want to manage multiple products easily so I can maintain my inventory

### 6.2 Buyer User Stories

#### 6.2.1 Product Discovery
- **US-B01**: As a buyer, I want to swipe through products like a dating app so I can quickly discover items I like
- **US-B02**: As a buyer, I want to browse products by craft category so I can find specific types of items
- **US-B03**: As a buyer, I want to see trending products so I can discover popular items
- **US-B04**: As a buyer, I want to read the story behind each product so I can understand its cultural significance
- **US-B05**: As a buyer, I want to see high-quality product images so I can evaluate the craftsmanship

#### 6.2.2 Shopping Experience
- **US-B06**: As a buyer, I want to add products to my cart with a simple swipe so I can shop quickly
- **US-B07**: As a buyer, I want to save products to a wishlist so I can purchase them later
- **US-B08**: As a buyer, I want to undo accidental swipes so I don't miss products I'm interested in
- **US-B09**: As a buyer, I want to appreciate artisans with a long-press gesture so I can show support
- **US-B10**: As a buyer, I want to view detailed product information by tapping the card so I can make informed decisions

#### 6.2.3 Navigation & Exploration
- **US-B11**: As a buyer, I want to explore craft categories in a gamified way so the experience is engaging
- **US-B12**: As a buyer, I want to see how many artisans are in each category so I know the variety available
- **US-B13**: As a buyer, I want smooth animations and transitions so the app feels polished and modern
- **US-B14**: As a buyer, I want to easily switch between different discovery modes (feed, swipe, categories) so I can browse in my preferred way

#### 6.2.4 Purchase & Support
- **US-B15**: As a buyer, I want to see the artisan's location so I can support local craftspeople
- **US-B16**: As a buyer, I want to view the artisan's profile so I can see their other products
- **US-B17**: As a buyer, I want to complete purchases securely so I can trust the platform
- **US-B18**: As a buyer, I want to track my orders so I know when to expect delivery

### 6.3 Platform User Stories

#### 6.3.1 Cross-Role Functionality
- **US-P01**: As a user, I want to select my preferred language at the start so the entire app is in my language
- **US-P02**: As a user, I want to choose my role (artisan or buyer) so I see relevant features
- **US-P03**: As a user, I want to switch between roles easily so I can both sell and buy
- **US-P04**: As a user, I want to sign in with my Google account so I don't need to create a new password

#### 6.3.2 Accessibility & Usability
- **US-P05**: As a user with limited internet, I want the app to work on slow connections so I can use it anywhere
- **US-P06**: As a user with a low-end phone, I want smooth performance so the app doesn't lag
- **US-P07**: As a user, I want clear error messages so I know what went wrong and how to fix it
- **US-P08**: As a user, I want the app to remember my preferences so I don't have to set them every time

---

## 7. DESIGN SYSTEM

### 7.1 Color Palette

#### 7.1.1 Primary Colors
- **Terracotta**: #E07A5F (Primary brand color)
- **Warm Orange**: #D97706 to #F59E0B (Gradients)
- **Soft Gold**: #D4AC0D (Accent highlights)
- **Light Beige**: #F5E9DE (Background)

#### 7.1.2 Secondary Colors
- **Blue-Cyan**: #3B82F6 to #06B6D4 (Buyer role)
- **Green-Emerald**: #10B981 to #059669 (Success states)
- **Red-Pink**: #EF4444 to #EC4899 (Dismiss/error states)
- **Yellow-Amber**: #F59E0B to #FBBF24 (Wishlist/warning)

#### 7.1.3 Neutral Colors
- **Gray Scale**: #F9FAFB to #111827 (Text and backgrounds)
- **White**: #FFFFFF (Cards and surfaces)
- **Black**: #000000 (Text and icons)

### 7.2 Typography

#### 7.2.1 Font Family
- **Primary Font**: 'PT Sans' (Humanist sans-serif)
- **Fallback**: system-ui, -apple-system, sans-serif
- **Monospace**: 'Courier New', monospace (for code)

#### 7.2.2 Font Sizes
- **Display**: 3xl-6xl (48px-96px) for hero headings
- **Heading**: xl-2xl (24px-32px) for section titles
- **Body**: base-lg (16px-18px) for main content
- **Small**: sm-xs (12px-14px) for captions and labels

#### 7.2.3 Font Weights
- **Bold**: 700 (Headings and emphasis)
- **Semibold**: 600 (Subheadings)
- **Medium**: 500 (Buttons and labels)
- **Regular**: 400 (Body text)

### 7.3 Spacing & Layout

#### 7.3.1 Spacing Scale
- **Base Unit**: 4px (0.25rem)
- **Scale**: 0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
- **Container Max Width**: 1280px (7xl)
- **Content Max Width**: 768px (4xl)

#### 7.3.2 Border Radius
- **Small**: 0.375rem (6px) for buttons
- **Medium**: 0.5rem (8px) for cards
- **Large**: 0.75rem (12px) for modals
- **XLarge**: 1rem (16px) for hero elements
- **Full**: 9999px for circular elements

#### 7.3.3 Shadows
- **Small**: 0 1px 2px rgba(0,0,0,0.05)
- **Medium**: 0 4px 6px rgba(0,0,0,0.1)
- **Large**: 0 10px 15px rgba(0,0,0,0.1)
- **XLarge**: 0 20px 25px rgba(0,0,0,0.15)
- **2XLarge**: 0 25px 50px rgba(0,0,0,0.25)

### 7.4 Iconography

#### 7.4.1 Icon Style
- **Library**: Lucide React
- **Style**: Outline/stroke icons
- **Sizes**: 16px, 20px, 24px, 32px, 48px
- **Stroke Width**: 2px (default)

#### 7.4.2 Custom Icons
- **Artisan Icon**: Hand-drawn style pottery/craft symbol
- **Buyer Icon**: Shopping bag with heart
- **Camera Icon**: Simplified camera outline

### 7.5 Animation Principles

#### 7.5.1 Timing Functions
- **Ease-In-Out**: Default for most transitions
- **Spring**: Framer Motion spring for natural movement
- **Duration**: 200-500ms for UI transitions

#### 7.5.2 Animation Types
- **Fade**: Opacity transitions for content
- **Slide**: Position transitions for navigation
- **Scale**: Size transitions for emphasis
- **Rotate**: Rotation for playful interactions

---

## 8. DEPLOYMENT & HOSTING

### 8.1 Current Deployment (Demo)

#### 8.1.1 Development Environment
- **Platform**: Firebase Studio / Google Cloud Workstations
- **Dev Server**: localhost with Turbopack
- **Hot Reload**: Automatic code reloading
- **Environment Variables**: .env.local for API keys

#### 8.1.2 Build Configuration
- **Build Command**: `npm run build`
- **Output**: `.next` directory with optimized bundles
- **Static Export**: Not used (using Next.js server features)

### 8.2 Production Deployment (Future)

#### 8.2.1 Hosting Options
- **Vercel**: Recommended for Next.js (automatic optimization)
- **AWS Amplify**: For full AWS integration
- **Firebase Hosting**: For Firebase backend integration
- **Custom Server**: Node.js server on EC2/ECS

#### 8.2.2 CI/CD Pipeline
- **Version Control**: Git (GitHub/GitLab)
- **Automated Testing**: Run tests on PR
- **Build Automation**: Automatic builds on merge
- **Deployment**: Automatic deployment to staging/production

#### 8.2.3 Environment Management
- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live user-facing environment
- **Environment Variables**: Managed per environment

---

## 9. COMPLIANCE & LEGAL

### 9.1 Data Protection

#### 9.1.1 Privacy Policy
- Clear disclosure of data collection practices
- User consent for data processing
- Right to access and delete personal data
- Data retention policies

#### 9.1.2 Terms of Service
- User responsibilities and acceptable use
- Intellectual property rights
- Liability limitations
- Dispute resolution process

### 9.2 E-Commerce Compliance

#### 9.2.1 Payment Regulations
- **PCI DSS**: Compliance for payment card data
- **RBI Guidelines**: Reserve Bank of India regulations
- **UPI Compliance**: NPCI guidelines for UPI payments
- **Tax Compliance**: GST collection and remittance

#### 9.2.2 Consumer Protection
- **Return Policy**: Clear return and refund policies
- **Product Authenticity**: Verification of handmade claims
- **Dispute Resolution**: Mechanism for buyer-seller disputes
- **Customer Support**: Accessible support channels

### 9.3 Content Moderation

#### 9.3.1 Product Listings
- **Prohibited Items**: List of banned products
- **Content Guidelines**: Standards for product descriptions
- **Image Guidelines**: Appropriate product photography
- **Automated Moderation**: AI-based content screening

#### 9.3.2 User-Generated Content
- **Review Moderation**: Screening of product reviews
- **Spam Prevention**: Anti-spam measures
- **Abuse Reporting**: User reporting mechanisms
- **Content Takedown**: Process for removing violating content

---

## 10. SUCCESS METRICS

### 10.1 Artisan Metrics

#### 10.1.1 Onboarding Success
- **Completion Rate**: % of artisans who complete product listing
- **Time to First Listing**: Average time to publish first product
- **Voice Usage**: % of artisans using voice features
- **Language Distribution**: Usage across 9 Indian languages

#### 10.1.2 Engagement Metrics
- **Active Artisans**: Monthly active artisan count
- **Products Listed**: Total and average products per artisan
- **Listing Quality**: AI enhancement adoption rate
- **Return Rate**: % of artisans who list multiple products

### 10.2 Buyer Metrics

#### 10.2.1 Discovery Metrics
- **Swipe Engagement**: Average swipes per session
- **Category Exploration**: % of buyers exploring categories
- **Product Views**: Average products viewed per session
- **Time on Platform**: Average session duration

#### 10.2.2 Conversion Metrics
- **Add to Cart Rate**: % of products added to cart
- **Wishlist Rate**: % of products wishlisted
- **Purchase Conversion**: % of cart items purchased
- **Average Order Value**: Mean transaction value

### 10.3 Platform Metrics

#### 10.3.1 Technical Performance
- **Page Load Time**: Average load time across pages
- **API Response Time**: Average API latency
- **Error Rate**: % of requests resulting in errors
- **Uptime**: Platform availability percentage

#### 10.3.2 User Satisfaction
- **Net Promoter Score (NPS)**: User recommendation likelihood
- **User Retention**: % of users returning monthly
- **Feature Adoption**: Usage of key features
- **Support Tickets**: Volume and resolution time

---

## 11. RISKS & MITIGATION

### 11.1 Technical Risks

#### 11.1.1 AI Service Reliability
- **Risk**: AI services (Gemini) may be unavailable or slow
- **Mitigation**: 
  - Implement fallback mechanisms (client-side processing)
  - Cache AI responses where possible
  - Provide manual alternatives for all AI features
  - Monitor AI service health and switch providers if needed

#### 11.1.2 Voice Recognition Accuracy
- **Risk**: Speech-to-text may be inaccurate for regional accents
- **Mitigation**:
  - Provide visual transcription for verification
  - Allow manual editing of transcriptions
  - Train custom models for Indian languages (future)
  - Offer text input as alternative

#### 11.1.3 Browser Compatibility
- **Risk**: Web Speech API not supported in all browsers
- **Mitigation**:
  - Detect browser capabilities and show appropriate UI
  - Provide text input fallback
  - Guide users to supported browsers
  - Consider native app for better compatibility (future)

#### 11.1.4 Performance on Low-End Devices
- **Risk**: Heavy animations and images may lag on budget phones
- **Mitigation**:
  - Optimize images with Next.js Image component
  - Use hardware-accelerated CSS transforms
  - Implement lazy loading for images and components
  - Provide reduced motion option
  - Test on low-end Android devices

### 11.2 Business Risks

#### 11.2.1 Artisan Adoption
- **Risk**: Artisans may be hesitant to adopt digital platform
- **Mitigation**:
  - Provide in-person training and support
  - Create video tutorials in regional languages
  - Partner with artisan cooperatives
  - Offer incentives for early adopters
  - Showcase success stories

#### 11.2.2 Product Quality Control
- **Risk**: Inconsistent product quality may harm platform reputation
- **Mitigation**:
  - Implement product verification process
  - Collect buyer reviews and ratings
  - Provide quality guidelines for artisans
  - Offer photography tips and support
  - Monitor and address quality complaints

#### 11.2.3 Payment Processing
- **Risk**: Payment failures or fraud may occur
- **Mitigation**:
  - Use established payment gateways (Razorpay, Stripe)
  - Implement fraud detection mechanisms
  - Provide clear refund policies
  - Escrow payments until delivery confirmation
  - Monitor suspicious transactions

### 11.3 Operational Risks

#### 11.3.1 Scalability
- **Risk**: Platform may not scale with user growth
- **Mitigation**:
  - Design for horizontal scaling from start
  - Use serverless architecture (Lambda, DynamoDB)
  - Implement caching strategies
  - Monitor performance metrics
  - Load test before major launches

#### 11.3.2 Content Moderation
- **Risk**: Inappropriate content may be posted
- **Mitigation**:
  - Implement AI-based content screening
  - Provide user reporting mechanisms
  - Manual review for flagged content
  - Clear content guidelines
  - Swift takedown process

#### 11.3.3 Customer Support
- **Risk**: Support requests may overwhelm team
- **Mitigation**:
  - Comprehensive FAQ and help documentation
  - Chatbot for common queries (future)
  - Tiered support system
  - Community forums for peer support
  - Multilingual support team

---

## 12. ROADMAP & MILESTONES

### 12.1 Phase 1: MVP (Current - Hackathon Demo)
**Timeline**: Completed
**Status**: ✅ Complete

- ✅ Basic authentication (Google OAuth)
- ✅ Language selection (9 Indian languages)
- ✅ Role selection (Artisan/Buyer)
- ✅ Voice-guided product listing
- ✅ Camera capture and image enhancement
- ✅ Voice story recording
- ✅ AI-powered product details generation
- ✅ Swipe-based product discovery
- ✅ Category navigation (Duolingo-style)
- ✅ Product detail pages
- ✅ Wishlist and cart (localStorage)
- ✅ Demo mode with localStorage persistence

### 12.2 Phase 2: Beta Launch
**Timeline**: 3-6 months post-hackathon
**Focus**: Production readiness and user testing

- [ ] Firebase/Firestore integration
- [ ] User authentication with Cognito
- [ ] Real payment processing (Razorpay)
- [ ] Order management system
- [ ] Artisan dashboard
- [ ] Buyer profile and order history
- [ ] Product search functionality
- [ ] Push notifications
- [ ] Email notifications
- [ ] Beta testing with 50 artisans and 500 buyers

### 12.3 Phase 3: AWS Migration
**Timeline**: 6-9 months post-hackathon
**Focus**: Scalability and advanced AI features

- [ ] Migrate to AWS infrastructure
- [ ] Amazon Polly for TTS
- [ ] Amazon Transcribe for STT
- [ ] Amazon Bedrock (Claude) for AI
- [ ] Amazon Rekognition for image analysis
- [ ] S3 for image storage with CloudFront CDN
- [ ] DynamoDB for data persistence
- [ ] Lambda functions for serverless compute
- [ ] API Gateway for API management
- [ ] CloudWatch for monitoring

### 12.4 Phase 4: Feature Expansion
**Timeline**: 9-12 months post-hackathon
**Focus**: Enhanced features and marketplace growth

- [ ] Artisan profiles and portfolios
- [ ] Direct messaging between buyers and artisans
- [ ] Product customization requests
- [ ] Bulk order support
- [ ] Wholesale marketplace
- [ ] Artisan verification badges
- [ ] Featured artisan program
- [ ] Seasonal collections and campaigns
- [ ] Gift wrapping and personalization
- [ ] International shipping support

### 12.5 Phase 5: Platform Maturity
**Timeline**: 12-18 months post-hackathon
**Focus**: Community building and ecosystem growth

- [ ] Artisan training programs
- [ ] Video tutorials and workshops
- [ ] Community forums
- [ ] Artisan cooperatives support
- [ ] Sustainability certifications
- [ ] Fair trade verification
- [ ] Artisan stories and documentaries
- [ ] Mobile app (iOS and Android)
- [ ] Offline mode support
- [ ] AR product preview
- [ ] Social sharing features
- [ ] Referral program
- [ ] Loyalty rewards

---

## 13. APPENDICES

### 13.1 Glossary

- **Artisan**: A skilled craftsperson who creates handmade products
- **Buyer/Collector**: A customer who purchases handcrafted products
- **Craft Story**: A narrative about the product's creation and cultural significance
- **Swipe Deck**: Tinder-style interface for product discovery
- **Category Path**: Duolingo-style visual journey through craft categories
- **Voice Assistant**: AI-powered voice guidance system for artisans
- **AI Enhancement**: Automatic improvement of product images and descriptions
- **TTS**: Text-to-Speech conversion
- **STT**: Speech-to-Text conversion
- **PWA**: Progressive Web App
- **GSI**: Global Secondary Index (DynamoDB)
- **CDN**: Content Delivery Network

### 13.2 References

#### 13.2.1 Technology Documentation
- Next.js Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion
- Genkit AI: https://firebase.google.com/docs/genkit
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

#### 13.2.2 AWS Services
- Amazon Polly: https://aws.amazon.com/polly
- Amazon Transcribe: https://aws.amazon.com/transcribe
- Amazon Bedrock: https://aws.amazon.com/bedrock
- Amazon Rekognition: https://aws.amazon.com/rekognition
- Amazon S3: https://aws.amazon.com/s3
- Amazon DynamoDB: https://aws.amazon.com/dynamodb
- Amazon Cognito: https://aws.amazon.com/cognito

#### 13.2.3 Design Inspiration
- Duolingo: Gamified learning path design
- Tinder: Swipe-based discovery interface
- Etsy: Artisan marketplace model
- Instagram: Visual storytelling approach

### 13.3 Contact Information

**Project Name**: Zariya
**Project Type**: Hackathon Submission / MVP
**Development Status**: Demo/Prototype
**Technology Stack**: Next.js 15, TypeScript, Tailwind CSS, Genkit AI
**Target Market**: India (Primary), Global (Future)
**Primary Language**: English + 9 Indian Languages

---

## 14. CONCLUSION

Zariya represents a paradigm shift in how traditional artisans can access digital marketplaces. By leveraging voice-first AI technology, the platform removes barriers of digital literacy and language, enabling artisans to showcase their crafts to a global audience. The swipe-based discovery experience for buyers creates an engaging, modern interface that highlights the stories and cultural significance behind each handcrafted product.

The current MVP demonstrates the core functionality with a focus on user experience and accessibility. The roadmap outlines a clear path to production readiness, AWS migration for scalability, and feature expansion to build a thriving artisan ecosystem.

**Key Differentiators**:
1. Voice-first interface designed for low digital literacy
2. AI-powered assistance for product listing and enhancement
3. Engaging swipe-based discovery for buyers
4. Multilingual support for 9 Indian languages
5. Cultural storytelling integrated into product listings
6. Mobile-first design optimized for low-end devices

**Success Criteria**:
- Enable 1000+ artisans to list products within first year
- Achieve 80%+ completion rate for product listings
- Maintain 4.5+ star rating from users
- Process 10,000+ transactions in first year
- Expand to 5+ Indian states

Zariya is not just a marketplace—it's a bridge between tradition and technology, empowering artisans while preserving cultural heritage for future generations.

---

**Document Version**: 1.0
**Last Updated**: February 15, 2026
**Status**: Final - Hackathon Submission

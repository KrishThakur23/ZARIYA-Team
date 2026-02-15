# 🎨 Zariya - Voice-First Artisan Marketplace

> *Bridging traditional craftsmanship with modern commerce through AI-powered voice assistance*

Zariya is a revolutionary marketplace that empowers traditional artisans to showcase and sell their handcrafted products without digital literacy barriers. Using conversational AI and voice-first design, artisans can list products naturally while buyers discover unique treasures through an intuitive, story-driven interface.

---

## 🌟 Core Innovation

**Problem**: Traditional artisans struggle with digital platforms due to literacy barriers and complex form-based interfaces.

**Solution**: Voice-guided product listing with AI assistance that:
- Captures product photos with real-time guidance
- Transcribes artisan stories through natural conversation
- Enhances narratives with AI-powered storytelling
- Suggests optimal pricing based on market analysis
- Publishes products instantly to a premium marketplace

---

## ✨ Key Features

### For Artisans (Sellers)
- 🎤 **Voice-First Interface**: Speak naturally in your preferred language
- 📸 **AI-Guided Photography**: Get real-time suggestions for perfect product shots
- 📝 **Story Transcription**: Your words become compelling product narratives
- 💰 **Smart Pricing**: AI-suggested pricing based on materials, time, and market
- 🌍 **Multilingual Support**: Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, English
- 📊 **Dashboard Analytics**: Track views, likes, and engagement

### For Buyers
- 💳 **Swipe Discovery**: Tinder-style product exploration with gesture controls
- 🗺️ **Category Journey**: Duolingo-inspired navigation through craft categories
- ❤️ **Wishlist & Cart**: Save favorites and manage purchases
- 📖 **Artisan Stories**: Connect with the cultural significance behind each piece
- ⭐ **Curated Feed**: Trending and personalized product recommendations

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: React hooks, localStorage (demo)

### AI & Voice
- **LLM**: Google Gemini 2.5 Flash (via Genkit)
- **Text-to-Speech**: Google Gemini TTS
- **Speech-to-Text**: Browser Web Speech API
- **Image Enhancement**: Google Gemini Vision

### Data (Demo Mode)
- **Storage**: Browser localStorage
- **Images**: Placeholder URLs

### Planned AWS Migration
- **AI**: AWS Bedrock (Claude)
- **Voice**: AWS Polly (TTS) + Transcribe (STT)
- **Images**: Amazon S3 + Rekognition
- **Database**: Amazon DynamoDB
- **Auth**: Amazon Cognito

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google AI API key (for Gemini)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/PashinP/studio.git
cd studio
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env.local file
echo "GOOGLE_GENAI_API_KEY=your_api_key_here" > .env.local
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

---

## 📱 Usage

### As an Artisan
1. Select your preferred language
2. Choose "I'm an Artisan"
3. Follow voice-guided tutorial
4. Capture product photo
5. Speak your product story
6. Review AI-enhanced listing
7. Publish to marketplace

### As a Buyer
1. Browse trending products on home feed
2. Swipe through discovery deck:
   - **Swipe Right**: Add to cart
   - **Swipe Left**: Hide product
   - **Swipe Up**: Add to wishlist
   - **Long Press**: Appreciate artisan
3. View product details and artisan stories
4. Manage cart and wishlist

---

## 📂 Project Structure
```
zariya/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── artisan/           # Artisan product listing flow
│   │   ├── buyer/             # Buyer marketplace interface
│   │   ├── api/               # API routes
│   │   └── page.tsx           # Landing/language selection
│   ├── components/            # React components
│   │   ├── artisan/          # Artisan-specific components
│   │   ├── buyer/            # Buyer-specific components
│   │   └── ui/               # Shared UI primitives
│   ├── ai/                    # AI flows and configuration
│   │   ├── flows/            # Genkit AI flows
│   │   └── genkit.ts         # Genkit setup
│   └── lib/                   # Utilities and schemas
├── requirements.md            # Project requirements
├── design.md                  # Architecture & design system
└── package.json
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Terracotta Orange (#E87722)
- **Background**: Warm Cream (#F5F1EB)
- **Accent**: Amber Gradient
- **Text**: Rich Brown/Black

### Typography
- **Headlines**: Playfair Display (serif)
- **Body**: Inter/Roboto (sans-serif)

### Interaction Patterns
- **Hover Effects**: Card lift with shadow enhancement
- **Button Feedback**: Active scale-down (0.95)
- **Animations**: Smooth 300ms transitions

---

## 🗺️ Roadmap

### Phase 1: Core MVP ✅
- [x] Voice-guided product listing
- [x] Speech transcription
- [x] AI story enhancement
- [x] Swipe-based discovery
- [x] Category navigation
- [x] Product preview & publishing

### Phase 2: AWS Migration 🔄
- [ ] Migrate to AWS Bedrock for AI generation
- [ ] Implement AWS Polly for multilingual TTS
- [ ] Add AWS Transcribe for robust STT
- [ ] Set up S3 for image storage
- [ ] Configure DynamoDB for data persistence
- [ ] Integrate Cognito for authentication

### Phase 3: Advanced Features 📋
- [ ] Real-time inventory management
- [ ] Payment gateway integration
- [ ] Shipping & logistics
- [ ] Artisan verification system
- [ ] Buyer reviews & ratings
- [ ] Advanced analytics dashboard

---

## 🎯 Use Cases

### Artisan Success Story
*"I'm a pottery artist from Jaipur. I don't know how to type, but with Zariya, I just spoke about my blue pottery technique in Hindi, and it created a beautiful listing. I got my first order within 2 days!"*

### Buyer Experience
*"I love discovering unique handcrafted items. The swipe interface makes it fun, and reading the artisan's story makes each purchase meaningful."*

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Project Lead**: Pashin  
**Built for**: Amazon Hackathon 2025  
**Demo**: [https://firebase-ten-roan.vercel.app](https://firebase-ten-roan.vercel.app)

---

## 📞 Contact

For questions, feedback, or collaboration opportunities:
- **GitHub**: [@PashinP](https://github.com/PashinP)
- **Email**: [Your Email]

---

## 🙏 Acknowledgments

- Inspired by traditional Indian artisans and their craft heritage
- Built with love using Next.js, Google Gemini, and modern web technologies
- Special thanks to the open-source community

---

<div align="center">

**Made with ❤️ for artisans everywhere**

⭐ Star this repo if you support traditional craftsmanship! ⭐

</div>
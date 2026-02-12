# Social E-Commerce Platform (TikTok Shop Clone)

A mobile-first social e-commerce web application inspired by TikTok Shop, built with React, Tailwind CSS, and modern web technologies.

## 🎯 Features

### ✅ Implemented

1. **Home Feed (Video Shopping Experience)**
   - Full-screen vertical video feed with product integration
   - Right-side action buttons (Like, Comment, Share, Wishlist)
   - Floating product tag that opens a drawer with product details
   - Smooth animations and transitions
   - Swipe indicators for multiple videos

2. **Semantic Search (Discover Page)**
   - AI-powered chat-like search interface
   - 2-column product grid layout
   - Popular search suggestions
   - Real-time product filtering

3. **Profile & Social Features**
   - User stats (Followers, Following, Likes)
   - Three tabs: Reels, Products, Reviews
   - Dedicated Wishlist section
   - Product showcase grid

4. **Shopping Features**
   - **Basket Management**: Add/remove items, adjust quantities
   - **Wishlist**: Save favorite products
   - **Product Drawer**: Size and color selection, detailed product view
   - **Checkout Flow**: Address and payment method selection

5. **Bottom Navigation**
   - 5 tabs: Home, Discover, Create, Basket, Profile
   - Active state indicators
   - Badge counter for basket items
   - Special gradient "Plus" button

## 🛠 Tech Stack

- **Framework**: React with React Router (v7)
- **Styling**: Tailwind CSS v4 (Minimalist Black & White UI)
- **Components**: Shadcn UI (Drawers, Buttons, Inputs, Tabs)
- **Icons**: Lucide React
- **State Management**: Zustand (Basket & Wishlist)
- **Notifications**: Sonner (Toast notifications)

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── BottomNav.tsx    # Persistent bottom navigation
│   │   └── ProductDrawer.tsx # Product details drawer
│   ├── pages/
│   │   ├── Home.tsx         # Video feed page
│   │   ├── Discover.tsx     # Semantic search & product grid
│   │   ├── Basket.tsx       # Shopping basket
│   │   ├── Profile.tsx      # User profile with tabs
│   │   ├── Checkout.tsx     # Checkout flow
│   │   └── Create.tsx       # Content creation page
│   ├── store/
│   │   ├── useBasketStore.ts   # Basket state management
│   │   └── useWishlistStore.ts # Wishlist state management
│   ├── data/
│   │   └── mockData.ts      # Mock products and videos
│   ├── types.ts             # TypeScript interfaces
│   ├── routes.ts            # React Router configuration
│   ├── Layout.tsx           # Main layout component
│   └── App.tsx              # Root component
└── imports/
    └── TikTokHome*.tsx      # Figma imported components
```

## 🎨 Design Features

- **Mobile-First**: Optimized for 414px viewport (iPhone-like experience)
- **Minimalist UI**: Black & White color scheme for clean, modern look
- **Smooth Animations**: Custom CSS animations for spinning disc, marquee text
- **Product Integration**: Seamless product discovery within video content
- **Responsive**: Works on all screen sizes

## 🚀 Key Interactions

1. **Video Feed Navigation**: Scroll or swipe between videos
2. **Like/Wishlist**: Double-tap or click heart to add to wishlist
3. **View Product**: Click floating product tag to open drawer
4. **Add to Basket**: Select size/color and add from product drawer
5. **Checkout**: Complete purchase with address and payment selection

## 📱 Pages

- `/` - Home feed with vertical videos
- `/discover` - Semantic search with product grid
- `/create` - Content creation hub
- `/basket` - Shopping cart with checkout
- `/profile` - User profile with tabs and wishlist
- `/checkout` - Complete purchase flow

## 🔄 State Management

### Basket Store (Zustand)
- Add/remove products
- Update quantities
- Calculate totals
- Persist selections (size, color)

### Wishlist Store (Zustand)
- Add/remove favorites
- Check if product is wishlisted
- Toggle wishlist status

## 🎯 Next Steps (Suggested Enhancements)

- Add video playback controls
- Implement real backend with database
- Add user authentication
- Enable actual video upload
- Integrate payment gateway
- Add order history
- Implement real-time notifications
- Add product recommendations
- Enable social features (follow, comments)

## 📝 Notes

- All product images are loaded from Unsplash
- Mock data is used for demonstration
- Video URLs are placeholders (static images used)
- Payment and checkout are UI-only (no backend)

---

Built with ❤️ for Figma Make

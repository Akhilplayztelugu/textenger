# Textenger - Android Social Chat App

A fully functional Android mobile social media app built with React, Vite, and Supabase. Features include social feed, short-form video clips, stories, direct messaging, and group chat rooms.

## 🚀 Features

- **Authentication**: Email/password signup and signin with Supabase Auth
- **Social Feed**: Share photos and videos with captions
- **Clips**: Short-form vertical videos with snap scrolling
- **Stories**: Temporary content that expires after 8 hours
- **Direct Messages**: Real-time private messaging
- **Rooms**: Group chat functionality
- **Real-time Updates**: Live updates for all content using Supabase Realtime
- **File Storage**: Secure media uploads with Supabase Storage
- **Mobile-First**: Optimized for Android devices with touch interactions

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Styling**: Tailwind CSS with custom dark purple gaming theme
- **UI Components**: Radix UI primitives
- **State Management**: React hooks and context

## 📱 Mobile-First Design

This app is specifically designed for Android mobile devices with:
- Touch-optimized interactions (48px minimum tap targets)
- Snap scrolling for clips between fixed top and bottom bars
- Responsive design for all Android screen ratios
- Native-feeling gestures and animations
- Dark purple gradient theme with neon accents

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://urkuqvzehvkxbthaqrsk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVya3VxdnplaHZreGJ0aGFxcnNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MjA4NjEsImV4cCI6MjA3MzM5Njg2MX0.z8d1VY5qsIkpLMb0z02xrMSzcfsKzpnqoeqUniVapM4
```

### Database Setup

The app includes SQL migration files in `supabase/migrations/` that set up:

1. **Tables**: profiles, posts, stories, clips, rooms, messages, notifications
2. **Storage Buckets**: avatars, posts, stories, clips, files
3. **RLS Policies**: Secure access control for all tables
4. **Realtime**: Live updates for all content
5. **Functions**: Auto-profile creation, notifications, story cleanup

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase project (already configured)

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
# Copy the provided environment variables to .env
cp .env.example .env
```

3. **Run database migrations**:
```bash
# Apply the SQL migrations to your Supabase project
# You can run these manually in the Supabase SQL editor
# or use the Supabase CLI if available
```

4. **Start development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📱 Testing on Android

### Web Browser Testing
1. Open the app in Chrome on your Android device
2. Add to home screen for app-like experience
3. Test all touch interactions and gestures

### PWA Installation
The app is designed to work as a Progressive Web App:
1. Visit the app URL in Chrome
2. Tap "Add to Home Screen"
3. Launch from home screen for full-screen experience

## 🗄 Database Schema

### Core Tables

- **profiles**: User profiles linked to auth.users
- **posts**: Feed posts with media
- **stories**: Temporary stories (8-hour expiry)
- **clips**: Short-form videos
- **rooms**: Chat rooms
- **room_chats**: Room messages
- **conversations**: DM conversations
- **messages**: DM messages
- **notifications**: User notifications

### Storage Buckets

- **avatars**: Profile pictures (5MB limit)
- **posts**: Feed media (50MB limit)
- **stories**: Story media (50MB limit)
- **clips**: Video clips (100MB limit)
- **files**: General attachments (100MB limit)

## 🔐 Security

### Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Allow users to modify only their own content
- Provide public read access for feed content
- Restrict private messages to participants only
- Ensure room access is limited to members

### Authentication

- Email/password authentication via Supabase Auth
- Automatic profile creation on signup
- Session management with auto-refresh tokens

## 🔄 Real-time Features

The app uses Supabase Realtime for:
- Live feed updates when new posts are created
- Real-time messaging in rooms and DMs
- Live like and comment updates
- Instant notifications
- Story updates and expiry

## 📊 Performance Optimizations

- Lazy loading for media content
- Efficient pagination for feeds and clips
- Optimized realtime subscriptions
- Image compression and optimization
- Smooth snap scrolling for clips

## 🎨 Design System

### Color Palette
- Primary: Purple gradient (#8b5cf6 to #a855f7)
- Background: Dark purple gradient
- Accents: Neon purple and cyan
- Text: White and purple variants

### Typography
- Font sizes optimized for mobile readability
- Consistent spacing using 8px grid system
- Gaming-inspired neon text effects

## 🧪 Testing Flows

### Authentication Flow
1. Open app → See auth screen
2. Sign up with email/password → Profile created
3. Sign in → Access main app

### Content Creation Flow
1. Tap + button → See creation options
2. Select Post/Story/Clip → Upload media
3. Add caption → Share → See in feed instantly

### Messaging Flow
1. Navigate to DMs/Rooms
2. Send message → Receive real-time updates
3. See typing indicators and read receipts

### Clips Flow
1. Navigate to Clips
2. Swipe up/down to navigate between clips
3. Double-tap to like
4. Smooth snap scrolling between content

## 🐛 Error Handling

- Comprehensive error boundaries
- User-friendly error messages
- Console logging for debugging
- Graceful fallbacks for network issues

## 📈 Analytics & Monitoring

- Console logging for key user actions
- Error tracking and reporting
- Performance monitoring for media loading
- Real-time connection status monitoring

## 🔮 Future Enhancements

- Push notifications
- Video compression
- Advanced search functionality
- User discovery features
- Enhanced moderation tools

## 📄 License

This project is part of the Textenger social platform.
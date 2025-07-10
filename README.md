# OhMyGerd - GERD Tracking Web Application

A comprehensive Progressive Web App (PWA) for tracking GERD symptoms and managing digestive health, seamlessly integrated with Liao Reflux Relief products.

## 🌟 Features

### Core Functionality
- **2-Minute Daily Tracking**: Quick symptom logging with 5 key metrics
- **Intelligent Analytics**: Visual progress tracking with charts and trends
- **Treatment Monitoring**: Liao Reflux Relief dose tracking and consistency metrics
- **Trigger Food Analysis**: Identify patterns between food and symptoms
- **Streak Tracking**: Gamified daily tracking to build healthy habits

### User Experience
- **Progressive Web App**: Install on any device, works offline
- **Responsive Design**: Optimized for desktop and mobile
- **Rooted Minimalism**: Clean, focused interface with warm functionality
- **Subtle Animations**: Luxury feel with gentle micro-interactions
- **Accessibility**: WCAG 2.1 AA compliant design

### Business Integration
- **Seamless Shop Integration**: Direct link to Liao products with UTM tracking
- **User Discounts**: 10% exclusive discount for app users
- **Admin Dashboard**: User analytics and business intelligence
- **Conversion Tracking**: Monitor app-to-purchase funnel

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks and context

### Backend
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth with JWT
- **API**: Next.js API routes
- **Security**: Row Level Security (RLS) policies
- **Real-time**: Supabase real-time subscriptions

### Deployment
- **Frontend Hosting**: Vercel
- **Backend**: Supabase (managed PostgreSQL)
- **Domain**: app.liaoherbal.com
- **Cost**: $0/month until significant scale

## 🎨 Design System

### Brand Colors
- **Primary**: #14301f (Main actions, headers)
- **Background**: #f6f4f0 (Background, cards)
- **Accent**: #df6552 (Clay Rose - accents, links)
- **Supporting**: Peach Bloom, Wheat, Apricot Veil

### Typography
- **Primary**: Inter (functionality, UI elements)
- **Headers**: Georgia serif fallback (emotional moments, headers)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Environment Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` with Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ADMIN_EMAILS=admin@liaoherbal.com
   ```
4. Set up Supabase database using `sql/schema.sql`
5. Run development server: `npm run dev`

## 📱 User Journey

### New User Flow
1. **Landing Page**: Value proposition and sign-up
2. **Registration**: Email/password with basic info
3. **Onboarding Survey**: 6-step health assessment
4. **Dashboard**: Personalized health insights
5. **Daily Tracking**: 2-minute symptom logging

### Returning User Flow
1. **Dashboard**: Progress overview and insights
2. **Quick Tracking**: Update today's symptoms
3. **Shop Integration**: Purchase Liao products
4. **Settings**: Manage preferences and data

## 🗄 Database Schema

### Core Tables
- **users**: Profile and health information
- **daily_entries**: Symptom tracking data
- **user_settings**: Preferences and configuration

### Key Features
- Row Level Security (RLS) for data privacy
- Automatic timestamps and audit trails
- Optimized indexes for performance
- GDPR/CCPA compliance ready

## 🔒 Security & Privacy

### Data Protection
- End-to-end encryption for sensitive health data
- GDPR/CCPA compliance
- HIPAA-adjacent privacy standards
- Secure authentication with JWT

## 📊 Analytics & Monitoring

### User Metrics
- Daily/Weekly/Monthly Active Users
- Tracking completion rates
- User retention and engagement

### Health Metrics
- Average symptom scores
- Treatment consistency rates
- User-reported improvements

### Business Metrics
- Shop conversion rates
- Revenue attribution from app
- Customer lifetime value

## 🚀 Deployment

The application is designed to be deployed on Vercel with Supabase backend:

1. Deploy to Vercel: `vercel --prod`
2. Configure custom domain: app.liaoherbal.com
3. Set up environment variables in Vercel dashboard
4. Enable analytics and monitoring

## 📈 Roadmap

### Phase 1: MVP (Complete)
- ✅ Authentication system
- ✅ Onboarding survey
- ✅ Daily tracking interface
- ✅ Basic dashboard
- ✅ Shop integration

### Phase 2: Enhanced Features
- [ ] Advanced analytics and insights
- [ ] Data export functionality
- [ ] Notification system
- [ ] Enhanced admin dashboard

### Phase 3: Mobile App
- [ ] React Native iOS app
- [ ] Push notifications
- [ ] Offline-first architecture

## 🤝 Contributing

This project is proprietary software owned by Liao Herbal. For technical support:
- Email: info@liaoherbal.com

---

**OhMyGerd** - Empowering your GERD journey through intelligent tracking and natural relief. 🌿

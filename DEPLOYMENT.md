# OhMyGerd Deployment Guide

## Quick Setup

The OhMyGerd GERD tracking application has been successfully created with all core features implemented. Here's how to deploy it:

## Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Custom Domain**: Access to configure DNS for app.liaoherbal.com

## Step 1: Database Setup

1. Create a new Supabase project
2. Go to the SQL editor in your Supabase dashboard
3. Copy and paste the contents of `sql/schema.sql`
4. Execute the SQL to create all tables, policies, and indexes

## Step 2: Environment Configuration

Update `.env.local` with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://app.liaoherbal.com
ADMIN_EMAILS=admin@liaoherbal.com
```

## Step 3: Local Testing

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to test the application locally.

## Step 4: Production Deployment

### Option A: Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Option B: Manual Deployment

```bash
npm run build
npm run start
```

## Step 5: Domain Configuration

1. Add a CNAME record pointing `app.liaoherbal.com` to your Vercel deployment
2. Configure the custom domain in Vercel dashboard
3. SSL certificate will be automatically provisioned

## Features Implemented

### ✅ Core Application
- [x] Landing page with value proposition
- [x] User authentication (signup/login)
- [x] 6-step onboarding survey
- [x] Daily symptom tracking (2-minute flow)
- [x] Interactive dashboard with charts
- [x] Progress analytics and insights
- [x] Shop integration with UTM tracking
- [x] Settings and profile management
- [x] Admin dashboard for analytics

### ✅ Technical Features
- [x] Next.js 14 with App Router
- [x] Tailwind CSS design system
- [x] Supabase database and authentication
- [x] TypeScript for type safety
- [x] Responsive design (mobile + desktop)
- [x] PWA manifest for app installation
- [x] Row Level Security (RLS) for data privacy

### ✅ Business Features
- [x] Liao product integration
- [x] 10% app user discount
- [x] UTM tracking for conversions
- [x] User analytics and metrics
- [x] GDPR/CCPA privacy compliance

## User Journey

### New User Experience
1. **Landing Page** → Value proposition and signup
2. **Registration** → Email/password with basic info
3. **Onboarding Survey** → 6-step health assessment
4. **Dashboard** → Personalized health insights
5. **Daily Tracking** → 2-minute symptom logging

### Daily Workflow
1. **Dashboard Overview** → Progress and insights
2. **Track Symptoms** → Quick 2-minute form
3. **View Trends** → Charts and analytics
4. **Shop Integration** → Purchase Liao products

## Database Schema

### Core Tables
- **users**: Profile and health information
- **daily_entries**: Symptom tracking data  
- **user_settings**: Preferences and configuration

### Key Metrics Tracked
- Discomfort level (1-10)
- Heartburn intensity (1-10)
- Sleep disruption (1-10)
- Symptoms checklist
- Treatment consistency
- Trigger food patterns

## Security & Privacy

- JWT authentication with Supabase
- Row Level Security (RLS) policies
- GDPR/CCPA compliant data handling
- Secure API endpoints
- Input validation and sanitization

## Performance

- Optimized for Core Web Vitals
- Progressive Web App capabilities
- Offline functionality with service workers
- Image optimization and lazy loading
- Code splitting and tree shaking

## Monitoring

- Vercel Analytics integration
- Supabase dashboard metrics
- Custom error logging
- Performance monitoring

## Support

For technical issues or questions:
- Email: support@liaoherbal.com
- Check logs in Vercel dashboard
- Monitor database in Supabase dashboard

---

The application is production-ready and includes all features specified in the original requirements. The 2-minute daily tracking experience, shop integration, and analytics dashboard provide a complete solution for GERD symptom management with seamless Liao product integration.
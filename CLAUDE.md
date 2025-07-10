# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OhMyGerd is a GERD (Gastroesophageal Reflux Disease) tracking Progressive Web App built with Next.js 15 and Supabase. The app allows users to track their GERD symptoms, manage their health journey, and integrates with Liao Reflux Relief products for a comprehensive treatment approach.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Setup
- Database schema is in `sql/schema.sql`
- Execute in Supabase SQL editor to set up tables, RLS policies, and indexes
- Uses PostgreSQL with Row Level Security (RLS) enabled

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAILS=admin@liaoherbal.com
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT
- **Styling**: Tailwind CSS v4 with custom design system
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

### Core Data Flow
1. **Authentication**: Users authenticate via Supabase Auth
2. **User Profile**: Stored in `users` table with health information
3. **Daily Tracking**: Symptoms recorded in `daily_entries` table
4. **Settings**: User preferences in `user_settings` table
5. **Analytics**: Charts generated from aggregated daily entries

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main user dashboard
│   ├── tracking/          # Daily symptom tracking
│   ├── survey/            # Onboarding health survey
│   ├── shop/              # Liao product integration
│   ├── settings/          # User preferences
│   └── admin/             # Admin analytics dashboard
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Button, Input, etc.)
│   └── charts/           # Chart components (BarChart, LineChart)
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication state management
│   └── useTracking.ts    # Tracking data management
└── lib/                  # Utilities and configuration
    ├── supabase.ts       # Supabase client setup
    ├── database.types.ts # TypeScript types for database
    └── utils.ts          # Utility functions
```

### Authentication System
- Uses Supabase Auth with email/password
- Demo mode available via `useAuth.ts` (falls back to mock data)
- Row Level Security (RLS) policies ensure data privacy
- Admin users have access to analytics dashboard

### Database Schema
- **users**: Profile and health information
- **daily_entries**: Daily symptom tracking with uniqueness constraint on user_id + entry_date
- **user_settings**: User preferences and notification settings
- All tables use UUID primary keys and include audit timestamps

### Design System
- Primary color: `#14301f` (dark green)
- Background: `#f6f4f0` (warm off-white)
- Accent: `#df6552` (clay rose)
- Custom color palette includes peach, wheat, and apricot variants
- Typography: Inter for UI, Georgia serif for headers

## Key Features

### User Journey
1. **Onboarding**: 6-step health assessment survey
2. **Daily Tracking**: 2-minute symptom logging (discomfort, heartburn, sleep disruption)
3. **Analytics**: Progress charts and trend analysis
4. **Shop Integration**: Direct link to Liao products with UTM tracking
5. **Settings**: Notification preferences and data management

### Admin Features
- User analytics dashboard at `/admin`
- Requires `is_admin = true` in users table
- Access to aggregated user data and metrics

## Development Notes

### Authentication Modes
- Production: Uses real Supabase authentication
- Development: Can use demo mode with mock data (`useAuth.ts`)
- Check `useAuth.original.ts` for production auth implementation

### Database Patterns
- All user data is protected by RLS policies
- Use `auth.uid()` for user identification in queries
- Automatic timestamp updates via triggers
- Optimized indexes for performance

### Form Validation
- React Hook Form with Zod schemas
- Consistent validation patterns across the app
- Custom error handling and display

### Chart Implementation
- Recharts for all data visualization
- Responsive design with mobile-friendly charts
- Color scheme matches overall design system

## Configuration Notes

### Next.js Configuration
- ESLint and TypeScript errors ignored during builds for demo purposes
- Standalone output for containerized deployment
- Supabase externalized for server-side rendering

### Tailwind Configuration
- Custom color palette with semantic naming
- Extended spacing and typography scales
- Custom animations for smooth interactions

### Deployment
- Designed for Vercel deployment
- Supabase backend with managed PostgreSQL
- Domain: app.liaoherbal.com
- Progressive Web App with manifest.json
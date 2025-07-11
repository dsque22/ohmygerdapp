# OhMyGerd App - Complete Deployment Guide

## 🎯 Overview

This guide will walk you through deploying the OhMyGerd GERD tracking PWA from development to production. The app uses Next.js 15 + Supabase + Vercel for a modern, scalable deployment.

**Tech Stack:**
- **Frontend**: Next.js 15 with App Router
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: Vercel
- **Domain**: app.liaoherbal.com

---

## 📋 Pre-Deployment Checklist

### Required Assets
- [ ] Product image: `/public/liao-product.png` ✅
- [ ] Logo: `/public/liao-logo.png` ✅  
- [ ] PWA Icons: Need to create these (see Step 2)
- [ ] Custom domain access
- [ ] Email access for admin account

### Required Accounts
- [ ] Supabase account (free tier available)
- [ ] Vercel account (free tier available)
- [ ] Domain registrar access (for DNS setup)

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign up/login
2. **Create a new project:**
   - Project name: `ohmygerd-app`
   - Database password: Generate a strong password and save it
   - Region: Choose closest to your users (US East for North America)
   - Wait for project to be created (~2 minutes)

3. **Set up the database:**
   - Go to SQL Editor in Supabase dashboard
   - Copy the contents of `/sql/schema.sql` from your project
   - Paste and execute the SQL script
   - This creates all tables, RLS policies, and indexes

4. **Get your environment variables:**
   - Go to Settings → API in Supabase
   - Copy these values:
     - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
     - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Step 2: Generate PWA Icons

The app needs PWA icons for mobile installation. Create these files:

1. **Create a 512x512 PNG icon:**
   - Use your Liao logo
   - Save as `/public/icon-512x512.png`

2. **Create a 192x192 PNG icon:**
   - Resize the same logo
   - Save as `/public/icon-192x192.png`

**Quick way:** Use an online PWA icon generator or ask a designer to create these.

### Step 3: Configure Environment Variables

1. **Create `.env.local` file in your project root:**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration  
NEXT_PUBLIC_APP_URL=https://app.liaoherbal.com
ADMIN_EMAILS=admin@liaoherbal.com
```

2. **Replace the values:**
   - Use the Supabase URL and key from Step 1
   - Update admin email if different

### Step 4: Switch to Production Auth

1. **Replace the demo auth with production auth:**
   - Rename `src/hooks/useAuth.ts` to `src/hooks/useAuth.demo.ts`
   - Rename `src/hooks/useAuth.original.ts` to `src/hooks/useAuth.ts`

2. **Test locally:**
   ```bash
   npm run dev
   ```
   - Try signing up with a real email
   - Check that authentication works

### Step 5: Deploy to Vercel

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up/login
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will detect it's a Next.js app

2. **Configure environment variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all the variables from your `.env.local` file
   - Make sure all variables are marked for Production, Preview, and Development

3. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete (~2-3 minutes)
   - You'll get a URL like `https://ohmygerd-app.vercel.app`

### Step 6: Set up Custom Domain

1. **Add domain in Vercel:**
   - Go to Project Settings → Domains
   - Add `app.liaoherbal.com`
   - Vercel will give you DNS records to add

2. **Configure DNS:**
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Add the DNS records provided by Vercel
   - Usually an A record or CNAME record

3. **Wait for DNS propagation:**
   - Can take 24-48 hours
   - Test with `dig app.liaoherbal.com`

### Step 7: Create Admin Account

1. **Sign up through your app:**
   - Go to `https://app.liaoherbal.com/signup`
   - Sign up with your admin email

2. **Grant admin access:**
   - Go to Supabase → Table Editor → users
   - Find your user record
   - Set `is_admin` to `true`
   - Save the changes

3. **Test admin access:**
   - Go to `https://app.liaoherbal.com/admin`
   - Should see the admin dashboard

---

## 🛠️ Configuration Files

### Environment Variables Explained

```bash
# Supabase Database Connection
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# Your Supabase project URL

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
# Public key for client-side Supabase requests

NEXT_PUBLIC_APP_URL=https://app.liaoherbal.com  
# Your app's production URL

ADMIN_EMAILS=admin@liaoherbal.com
# Comma-separated list of admin email addresses
```

### Build Configuration

The app is already configured for production with:
- Standalone output for optimal performance
- TypeScript/ESLint errors ignored during builds
- Supabase externalized for SSR
- Turbopack for fast development

---

## 📊 Monitoring & Maintenance

### Health Checks

1. **Database health:**
   - Go to Supabase → Database → Health
   - Monitor query performance and connections

2. **App performance:**
   - Vercel provides built-in analytics
   - Monitor Core Web Vitals and errors

3. **User activity:**
   - Check admin dashboard for user metrics
   - Monitor daily entries and user growth

### Backup Strategy

1. **Database backups:**
   - Supabase automatically backs up daily
   - Can manually backup via SQL export

2. **Code backups:**
   - Keep GitHub repository updated
   - Tag releases for easy rollback

### Update Process

1. **Make changes locally**
2. **Test thoroughly with `npm run dev`**
3. **Push to GitHub**
4. **Vercel auto-deploys from main branch**
5. **Monitor deployment for errors**

---

## 🔧 Troubleshooting

### Common Issues

**"Auth session missing" errors:**
- Check environment variables are set correctly
- Verify Supabase project is active
- Clear browser cache and cookies

**"Failed to fetch" errors:**
- Check CORS settings in Supabase
- Verify API keys are correct
- Check network connectivity

**Images not loading:**
- Verify image files are in `/public` folder
- Check file names match exactly
- Ensure images are optimized for web

**Build failures:**
- Check TypeScript errors: `npm run build`
- Verify all environment variables are set
- Check for missing dependencies

### Getting Help

1. **Check Vercel build logs** for deployment errors
2. **Check Supabase logs** for database issues
3. **Check browser console** for client-side errors
4. **Contact support:**
   - Supabase: [support@supabase.com](mailto:support@supabase.com)
   - Vercel: [support@vercel.com](mailto:support@vercel.com)

---

## 📈 Performance Optimization

### Database Optimization
- Indexes are already configured for optimal performance
- Row Level Security policies prevent unauthorized access
- Connection pooling handled by Supabase

### Frontend Optimization
- Next.js 15 provides automatic code splitting
- Images are optimized with Next.js Image component
- Fonts are preloaded for better performance

### Caching Strategy
- Static assets cached at CDN level
- Database queries cached appropriately
- API responses cached where possible

---

## 🔐 Security Considerations

### Authentication
- JWT tokens with automatic refresh
- Row Level Security on all database tables
- Admin access properly restricted

### Data Protection
- All data encrypted at rest (Supabase)
- HTTPS enforced for all connections
- No sensitive data in client-side code

### Privacy Compliance
- User data deletion functionality
- Data export functionality
- Minimal data collection approach

---

## 📱 PWA Features

### Installation
- App can be installed on mobile devices
- Custom icons and splash screens
- Offline capability (limited)

### Mobile Optimization
- Responsive design works on all devices
- Touch-friendly interface
- Bottom navigation for mobile

---

## 🎉 Post-Deployment Checklist

After successful deployment, verify:

- [ ] App loads at `https://app.liaoherbal.com`
- [ ] User can sign up and login
- [ ] Dashboard shows demo data correctly
- [ ] Tracking form works and saves data
- [ ] Settings page loads and saves changes
- [ ] Shop page redirects to Liao website
- [ ] Admin dashboard accessible (if admin)
- [ ] Mobile navigation works properly
- [ ] PWA installation works on mobile
- [ ] All images load correctly
- [ ] Forms submit without errors

---

## 📞 Support Information

**For deployment issues:**
- Check this guide first
- Review error messages carefully
- Test locally before deploying
- Check environment variables

**For ongoing maintenance:**
- Monitor user feedback
- Keep dependencies updated
- Review performance metrics
- Plan feature enhancements

---

## 🚀 You're Ready to Go!

Following this guide will get your OhMyGerd app live and ready for users. The architecture is solid, scalable, and ready for production traffic.

**Next steps after deployment:**
1. Test thoroughly with real users
2. Monitor performance and errors
3. Gather user feedback
4. Plan v2 features based on usage data

Good luck with your launch! 🎊
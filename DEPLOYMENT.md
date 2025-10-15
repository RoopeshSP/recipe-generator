# Deployment Guide

This guide provides step-by-step instructions for deploying your Smart Recipe Generator application to various hosting platforms.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the easiest and most reliable option for Next.js applications.

#### Prerequisites:
- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))

#### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/recipe-generator.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js app

3. **Set Environment Variables**
   In the Vercel dashboard:
   - Go to your project settings
   - Click "Environment Variables"
   - Add these variables:
     ```
     DATABASE_URL=your_postgresql_connection_string
     OPENAI_API_KEY=your_openai_api_key
     JWT_SECRET=your_jwt_secret
     NEXTAUTH_URL=https://your-app-name.vercel.app
     NEXTAUTH_SECRET=your_nextauth_secret
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a live URL like `https://your-app-name.vercel.app`

---

### Option 2: Railway (Great for Full-Stack Apps)

Railway provides both hosting and database services.

#### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Application**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL Database**
   - In your project, click "New"
   - Choose "Database" → "PostgreSQL"
   - Railway will provide a connection string

4. **Set Environment Variables**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_jwt_secret
   NEXTAUTH_URL=https://your-app-name.up.railway.app
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

---

### Option 3: Netlify (Alternative)

1. **Push to GitHub** (same as Vercel step 1)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

3. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add all required variables

---

### Option 4: Heroku (Traditional)

1. **Install Heroku CLI**
   ```bash
   # Download from heroku.com or use package manager
   npm install -g heroku-cli
   ```

2. **Create Heroku App**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Add PostgreSQL Addon**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NEXTAUTH_SECRET=your_nextauth_secret
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

---

## 🗄️ Database Setup

### Free Database Options:

1. **Supabase** (Recommended)
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy the connection string
   - Use in your environment variables

2. **PlanetScale** (MySQL)
   - Go to [planetscale.com](https://planetscale.com)
   - Create database
   - Get connection string

3. **Railway PostgreSQL**
   - Included with Railway deployment
   - Automatic connection string

4. **Neon** (PostgreSQL)
   - Go to [neon.tech](https://neon.tech)
   - Create database
   - Get connection string

---

## 🔧 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are set
- [ ] Database is accessible from hosting platform
- [ ] OpenAI API key is valid
- [ ] Code is pushed to GitHub
- [ ] No sensitive data in code (use environment variables)

---

## 🌐 Domain Setup (Optional)

### Custom Domain:

1. **Buy a domain** (from Namecheap, GoDaddy, etc.)

2. **Configure DNS**:
   - For Vercel: Add CNAME record pointing to your Vercel URL
   - For Netlify: Add CNAME record pointing to your Netlify URL
   - For Railway: Add CNAME record pointing to your Railway URL

3. **Update Environment Variables**:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```

---

## 🔍 Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version (use 18+)
   - Ensure all dependencies are in package.json
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database is accessible from hosting platform
   - Ensure database exists and is running

3. **Environment Variables**
   - Double-check variable names
   - Ensure no spaces around values
   - Verify special characters are escaped

4. **API Errors**
   - Check OpenAI API key is valid
   - Verify API quotas and billing
   - Check network connectivity

---

## 📊 Monitoring & Analytics

### Add Monitoring:

1. **Vercel Analytics** (if using Vercel)
   ```bash
   npm install @vercel/analytics
   ```

2. **Google Analytics**
   ```bash
   npm install gtag
   ```

3. **Error Tracking**
   ```bash
   npm install @sentry/nextjs
   ```

---

## 🚀 Performance Optimization

### For Production:

1. **Enable Image Optimization**
   - Already configured in Next.js

2. **Add Caching Headers**
   - Configure in vercel.json or hosting platform

3. **Database Optimization**
   - Add database indexes
   - Use connection pooling

4. **CDN Configuration**
   - Most platforms provide CDN automatically

---

## 💰 Cost Estimation

### Free Tiers:
- **Vercel**: Free for hobby projects
- **Railway**: $5/month for hobby plan
- **Netlify**: Free for personal projects
- **Heroku**: No free tier (paid plans start at $7/month)

### Database Costs:
- **Supabase**: Free tier available
- **PlanetScale**: Free tier available
- **Railway**: Included in hosting plan
- **Neon**: Free tier available

---

## 🎯 Recommended Setup

For the best experience, I recommend:

1. **Hosting**: Vercel
2. **Database**: Supabase
3. **Domain**: Custom domain (optional)
4. **Monitoring**: Vercel Analytics

This combination provides:
- ✅ Free hosting
- ✅ Free database
- ✅ Easy deployment
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Easy scaling

---

## 📞 Support

If you encounter issues:

1. Check the platform's documentation
2. Review error logs in hosting dashboard
3. Test locally first
4. Check environment variables
5. Verify database connectivity

Good luck with your deployment! 🚀

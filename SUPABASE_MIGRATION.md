# Supabase Migration Guide

This guide will help you migrate your Recipe Generator from PostgreSQL to Supabase for Vercel deployment.

## Prerequisites

- Supabase account (free tier available)
- Vercel account
- Your existing project files

## Step 1: Set up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Fill in the details:
   - **Name**: `recipe-generator`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be ready (2-3 minutes)

### 1.2 Get Connection Details

1. Go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Copy the **URI** format connection string
4. It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 1.3 Get Supabase API Keys (Optional)

1. Go to **Settings** → **API**
2. Copy the **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
3. Copy the **anon public** key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Step 2: Update Environment Variables

### 2.1 Local Development

1. Copy your existing `.env.local` file as backup:
   ```bash
   cp .env.local .env.local.backup
   ```

2. Update `.env.local` with your Supabase details:
   ```env
   # Database (Supabase)
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   
   # Your existing variables...
   JWT_SECRET="your-super-secret-jwt-key-here"
   OPENAI_API_KEY="your-openai-api-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   
   # Supabase (optional)
   NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

### 2.2 Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add/update these variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - Keep your existing variables (JWT_SECRET, OPENAI_API_KEY, etc.)

## Step 3: Set up Database Schema

### 3.1 Push Schema to Supabase

1. Make sure your `.env.local` has the correct `DATABASE_URL`
2. Run the following commands:

   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to Supabase
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

### 3.2 Verify Database Setup

1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. You should see your tables: `users`, `recipes`, `ingredients`, `instructions`, `favorites`, `reviews`
4. Check that sample data was inserted

## Step 4: Test Locally

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the application:
   - Visit `http://localhost:3000`
   - Try creating a recipe
   - Check if data is saved to Supabase

3. Verify in Supabase dashboard that data appears in the tables

## Step 5: Deploy to Vercel

### 5.1 Deploy

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Migrate to Supabase"
   git push origin main
   ```

2. Deploy to Vercel:
   ```bash
   npm run deploy:vercel
   ```

   Or use the Vercel dashboard to trigger a deployment.

### 5.2 Verify Deployment

1. Check your Vercel deployment URL
2. Test all functionality
3. Verify data is being saved to Supabase

## Step 6: Clean Up (Optional)

If everything works correctly:

1. You can delete your old PostgreSQL database
2. Update your documentation to reflect Supabase usage

## Troubleshooting

### Common Issues

1. **Connection refused**: Check your `DATABASE_URL` format
2. **Authentication failed**: Verify your database password
3. **Schema not found**: Run `npm run db:push` again
4. **Build fails**: Check that all environment variables are set in Vercel

### Getting Help

- Supabase Documentation: https://supabase.com/docs
- Vercel Documentation: https://vercel.com/docs
- Prisma Documentation: https://www.prisma.io/docs

## Benefits of Supabase

- ✅ Managed PostgreSQL database
- ✅ Built-in authentication (if you want to use it later)
- ✅ Real-time subscriptions
- ✅ Auto-scaling
- ✅ Free tier with generous limits
- ✅ Easy backup and restore
- ✅ Built-in dashboard for data management

## Next Steps

After successful migration, consider:

1. **Authentication**: Migrate to Supabase Auth for better user management
2. **Real-time features**: Add real-time recipe updates
3. **Storage**: Use Supabase Storage for recipe images
4. **Edge Functions**: Use Supabase Edge Functions for serverless logic

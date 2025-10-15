#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment preparation...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('📝 Please create .env.local from env.example and fill in your values:');
  console.log('   cp env.example .env.local');
  console.log('   # Then edit .env.local with your actual values\n');
  process.exit(1);
}

// Check if DATABASE_URL is set
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('DATABASE_URL=') || envContent.includes('DATABASE_URL="postgresql://username:password@localhost:5432/recipe_generator"')) {
  console.error('❌ DATABASE_URL not configured!');
  console.log('📝 Please set up your database connection string in .env.local\n');
  process.exit(1);
}

// Check if OPENAI_API_KEY is set
if (!envContent.includes('OPENAI_API_KEY=') || envContent.includes('OPENAI_API_KEY="your-openai-api-key-here"')) {
  console.warn('⚠️  OPENAI_API_KEY not configured!');
  console.log('📝 Your app will use fallback recipes without AI generation.');
  console.log('   Get your API key from: https://platform.openai.com/api-keys\n');
}

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('🗄️  Generating Prisma client...');
  execSync('npm run db:generate', { stdio: 'inherit' });

  console.log('🏗️  Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Push your code to GitHub:');
  console.log('   git add .');
  console.log('   git commit -m "Ready for deployment"');
  console.log('   git push origin main');
  console.log('\n2. Deploy to your chosen platform:');
  console.log('   • Vercel: https://vercel.com (recommended)');
  console.log('   • Railway: https://railway.app');
  console.log('   • Netlify: https://netlify.com');
  console.log('   • Heroku: https://heroku.com');
  console.log('\n3. Set up your database:');
  console.log('   • Supabase: https://supabase.com (recommended)');
  console.log('   • PlanetScale: https://planetscale.com');
  console.log('   • Railway: Includes database');
  console.log('\n4. Configure environment variables on your hosting platform');
  console.log('\n📖 For detailed instructions, see DEPLOYMENT.md');

} catch (error) {
  console.error('❌ Deployment preparation failed:', error.message);
  process.exit(1);
}

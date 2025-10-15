#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Setting up Smart Recipe Generator...\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
const envExamplePath = path.join(process.cwd(), 'env.example')

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env.local from env.example...')
    fs.copyFileSync(envExamplePath, envPath)
    console.log('✅ Created .env.local file')
    console.log('⚠️  Please update .env.local with your actual values:\n')
    console.log('   - DATABASE_URL: Your PostgreSQL connection string')
    console.log('   - JWT_SECRET: A random secret key')
    console.log('   - OPENAI_API_KEY: Your OpenAI API key\n')
  } else {
    console.log('❌ env.example file not found')
    process.exit(1)
  }
} else {
  console.log('✅ .env.local already exists')
}

// Install dependencies
console.log('📦 Installing dependencies...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Dependencies installed successfully\n')
} catch (error) {
  console.log('❌ Failed to install dependencies')
  process.exit(1)
}

// Generate Prisma client
console.log('🔧 Generating Prisma client...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma client generated\n')
} catch (error) {
  console.log('⚠️  Prisma client generation failed. Make sure DATABASE_URL is set in .env.local\n')
}

console.log('🎉 Setup complete! Next steps:\n')
console.log('1. Update .env.local with your actual values')
console.log('2. Set up your PostgreSQL database')
console.log('3. Run: npm run db:push (to create database tables)')
console.log('4. Run: npm run dev (to start the development server)')
console.log('\n📚 Check README.md for detailed instructions')

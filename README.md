# Smart Recipe Generator

A comprehensive AI-powered recipe generation and discovery platform built with Next.js, featuring intelligent ingredient matching, dietary preference filtering, and personalized recommendations.

## 🌟 Features

### Core Functionality
- **AI Recipe Generation**: Create custom recipes using OpenAI's GPT models
- **Ingredient Input**: Smart ingredient selection with autocomplete and suggestions
- **Dietary Preferences**: Support for vegetarian, vegan, gluten-free, and 8+ other dietary restrictions
- **Recipe Database**: 20+ predefined recipes across various cuisines and categories
- **Advanced Filtering**: Filter by difficulty, cooking time, calories, cuisine, and more

### User Experience
- **Recipe Suggestions**: Personalized recommendations based on user preferences and ratings
- **User Feedback**: Rate, save, and review recipes with detailed feedback system
- **Mobile Responsive**: Optimized design for all device sizes
- **Error Handling**: Comprehensive error boundaries and loading states
- **Search & Discovery**: Advanced search with multiple filter options

### Technical Features
- **Database Integration**: PostgreSQL with Prisma ORM
- **Real-time Updates**: Dynamic UI updates and state management
- **Fallback System**: Graceful degradation when AI services are unavailable
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Clean, intuitive interface with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (optional, has fallback recipes)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe_generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/recipe_generator"
   
   # OpenAI API (optional)
   OPENAI_API_KEY="your-openai-api-key-here"
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key-here"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Recipe Generation
- **Endpoint**: `POST /api/ai/generate-recipe`
- **Purpose**: Generate recipes using AI based on ingredients and preferences
- **Fallback**: Returns predefined recipes when AI is unavailable

### Recipe Management
- **GET /api/recipes**: List all recipes with optional filtering
- **POST /api/recipes**: Create new recipe
- **GET /api/recipes/[id]**: Get specific recipe
- **PUT /api/recipes/[id]**: Update recipe
- **DELETE /api/recipes/[id]**: Delete recipe

## 🛠️ Development

### Database Management
```bash
# Reset database with fresh seed data
npm run db:reset

# Open Prisma Studio
npm run db:studio

# Create new migration
npm run db:migrate
```

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── recipes/           # Recipe pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── recipe-generator.tsx
│   ├── ingredient-input.tsx
│   ├── advanced-filters.tsx
│   └── recipe-feedback.tsx
├── lib/                   # Utility libraries
│   ├── api.ts            # API client functions
│   └── seed-data.ts      # Predefined recipes
├── prisma/               # Database schema
└── scripts/              # Database seeding scripts
```

### Key Components

#### RecipeGenerator
Main component for AI-powered recipe creation with ingredient input and dietary preferences.

#### IngredientInput
Smart ingredient selection with autocomplete, quick-add buttons, and dietary preference filtering.

#### AdvancedFilters
Comprehensive filtering system for recipes including difficulty, cooking time, cuisine, and dietary restrictions.

#### RecipeFeedback
User interaction system for rating, saving, sharing, and reviewing recipes.

#### RecipeSuggestions
Personalized recipe recommendations based on user preferences and behavior.

## 🎨 Customization

### Adding New Recipes
1. Add recipe data to `lib/seed-data.ts`
2. Run `npm run db:seed` to update database
3. Recipes will appear in the discovery interface

### Styling
The app uses Tailwind CSS for styling. Key design tokens:
- Primary colors: Blue gradient theme
- Typography: Clean, readable fonts
- Spacing: Consistent 4px grid system
- Components: Card-based layout with subtle shadows

### API Integration
The app supports multiple AI providers:
- Primary: OpenAI GPT models
- Fallback: OpenRouter API
- Default: Predefined recipe database

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
OPENAI_API_KEY="your-openai-api-key"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-secret"
```

## 🔧 Troubleshooting

### Common Issues

**Database Connection Errors**
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database permissions

**AI Generation Not Working**
- Verify OPENAI_API_KEY is set
- Check API key permissions and billing
- App will fallback to predefined recipes

**Build Errors**
- Run `npm run db:generate` before building
- Ensure all environment variables are set
- Check TypeScript errors with `npm run lint`
- 

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This application requires an OpenAI API key for full functionality. Without it, the app will use a curated set of predefined recipes for demonstration purposes.

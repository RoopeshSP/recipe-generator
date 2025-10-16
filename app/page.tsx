"use client"

import { Suspense, useState } from 'react'
import { RecipeGrid } from '../components/recipe-grid'
import { Hero } from '../components/hero'
import { SearchBar } from '../components/search-bar'
import { CategoryFilter } from '../components/category-filter'
import { AdvancedFilters } from '../components/advanced-filters'
import { RecipeSuggestions } from '../components/recipe-suggestions'

interface FilterOptions {
  difficulty: string[]
  cookingTime: {
    min: number | null
    max: number | null
  }
  dietaryRestrictions: string[]
  cuisine: string[]
  rating: number | null
  calories: {
    min: number | null
    max: number | null
  }
}

export default function HomePage() {
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<string>('ALL')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    difficulty: [],
    cookingTime: { min: null, max: null },
    dietaryRestrictions: [],
    cuisine: [],
    rating: null,
    calories: { min: null, max: null }
  })

  const clearFilters = () => {
    setFilters({
      difficulty: [],
      cookingTime: { min: null, max: null },
      dietaryRestrictions: [],
      cuisine: [],
      rating: null,
      calories: { min: null, max: null }
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Hero onGenerated={() => {
        // Refresh suggestions when new recipes are generated
        setShowSuggestions(true)
      }} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Recipe Discovery Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Discover Amazing Recipes
            </h2>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {showSuggestions ? 'Browse All' : 'Get Suggestions'}
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <SearchBar onSearch={setSearch} />
              <CategoryFilter onCategoryChange={setCategory} />
            </div>
            
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>
        </div>

        {/* Content */}
        {showSuggestions ? (
          <RecipeSuggestions 
            userPreferences={{
              favoriteIngredients: ['chicken', 'tomato', 'garlic'],
              dietaryRestrictions: filters.dietaryRestrictions,
              favoriteCuisines: filters.cuisine,
              preferredDifficulty: filters.difficulty,
              ratingThreshold: filters.rating ?? undefined
            }}
          />
        ) : (
          <Suspense fallback={<RecipeGridSkeleton />}>
            <RecipeGrid 
              search={search} 
              category={category}
            />
          </Suspense>
        )}
      </div>
    </main>
  )
}

function RecipeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="flex gap-2 mt-4">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

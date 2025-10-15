"use client"

import { Suspense, useState } from 'react'
import { SearchBar } from '@/components/search-bar'
import { CategoryFilter } from '@/components/category-filter'
import { RecipeGrid } from '@/components/recipe-grid'

export default function RecipesPage() {
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<string>('ALL')

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Recipes</h1>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <SearchBar onSearch={setSearch} />
            <CategoryFilter onCategoryChange={setCategory} />
          </div>
        </div>

        <Suspense fallback={<RecipeGridSkeleton />}>
          <RecipeGrid search={search} category={category} />
        </Suspense>
      </div>
    </main>
  )
}

function RecipeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  )
}


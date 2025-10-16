'use client'

import { useQuery } from '@tanstack/react-query'
import { RecipeCard } from './recipe-card'
import { getRecipes } from '../lib/api'

interface RecipeGridProps {
  search?: string
  category?: string
}

export function RecipeGrid({ search, category }: RecipeGridProps) {
  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes', { search, category }],
    queryFn: async () => getRecipes({ search, category }),
  })

  if (isLoading) {
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load recipes. Please try again.</p>
      </div>
    )
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No recipes found. Create your first recipe!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

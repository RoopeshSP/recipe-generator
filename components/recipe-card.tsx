'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { Recipe } from '../types/recipe'
import toast from 'react-hot-toast'

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavorited(!isFavorited)
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites')
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <Link href={`/recipes/${recipe.id}`} className="group">
      <div className="card hover:shadow-lg transition-shadow duration-200">
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={recipe.imageUrl || 'https://via.placeholder.com/400x300?text=Recipe'}
            alt={recipe.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            {isFavorited ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          <div className="absolute bottom-3 left-3">
            <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-sm font-medium">
              {recipe.difficulty}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {recipe.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2">
            {recipe.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{formatTime(recipe.prepTime + recipe.cookTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserGroupIcon className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>

          {recipe.tags && (
            <div className="flex flex-wrap gap-1">
              {(typeof recipe.tags === 'string' 
                ? recipe.tags.split(', ').slice(0, 3)
                : Array.isArray(recipe.tags) 
                  ? recipe.tags.slice(0, 3)
                  : []
              ).map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

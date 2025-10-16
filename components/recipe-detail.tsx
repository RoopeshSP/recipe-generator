'use client'

import Image from 'next/image'
import { ClockIcon, UserGroupIcon, FireIcon } from '@heroicons/react/24/outline'
import { Recipe } from '../types/recipe'
import { RecipeFeedback } from './recipe-feedback'

interface RecipeDetailProps {
  recipe: Recipe
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Recipe Image */}
            <div className="lg:w-1/2">
              <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
                <Image
                  src={recipe.imageUrl || 'https://via.placeholder.com/600x400?text=Recipe'}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Recipe Info */}
            <div className="lg:w-1/2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {recipe.title}
                </h1>
                <p className="text-gray-600 text-lg">
                  {recipe.description}
                </p>
              </div>

              {/* Recipe Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>Prep: {formatTime(recipe.prepTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>Cook: {formatTime(recipe.cookTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserGroupIcon className="w-4 h-4" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                    {recipe.difficulty}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {recipe.tags && (
                <div className="flex flex-wrap gap-2">
                  {(typeof recipe.tags === 'string' 
                    ? recipe.tags.split(', ')
                    : Array.isArray(recipe.tags) 
                      ? recipe.tags
                      : []
                  ).map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Recipe Feedback */}
              <RecipeFeedback 
                recipeId={recipe.id}
                onRatingChange={(rating) => console.log('Rating changed:', rating)}
                onFavoriteToggle={(isFavorite) => console.log('Favorite toggled:', isFavorite)}
                onSaveToggle={(isSaved) => console.log('Save toggled:', isSaved)}
              />

              {/* Nutrition Info */}
              {(recipe.calories || recipe.protein || recipe.carbs || recipe.fat) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Nutrition (per serving)</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {recipe.calories && (
                      <div>
                        <span className="text-gray-600">Calories:</span>
                        <span className="ml-2 font-medium">{recipe.calories}</span>
                      </div>
                    )}
                    {recipe.protein && (
                      <div>
                        <span className="text-gray-600">Protein:</span>
                        <span className="ml-2 font-medium">{recipe.protein}g</span>
                      </div>
                    )}
                    {recipe.carbs && (
                      <div>
                        <span className="text-gray-600">Carbs:</span>
                        <span className="ml-2 font-medium">{recipe.carbs}g</span>
                      </div>
                    )}
                    {recipe.fat && (
                      <div>
                        <span className="text-gray-600">Fat:</span>
                        <span className="ml-2 font-medium">{recipe.fat}g</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="font-medium">{ingredient.amount} {ingredient.unit} </span>
                    <span>{ingredient.name}</span>
                    {ingredient.notes && (
                      <span className="text-gray-500 text-sm block">{ingredient.notes}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
            <ol className="space-y-6">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {instruction.stepNumber}
                  </span>
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {instruction.description}
                    </p>
                    {instruction.imageUrl && (
                      <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden">
                        <Image
                          src={instruction.imageUrl}
                          alt={`Step ${instruction.stepNumber}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

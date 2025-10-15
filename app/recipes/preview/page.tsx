'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ClockIcon, 
  UsersIcon, 
  StarIcon, 
  FireIcon,
  HeartIcon,
  ShareIcon,
  PrinterIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface GeneratedRecipe {
  title: string
  description: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: string
  category: string
  cuisine: string
  tags: string[]
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: Array<{
    name: string
    amount: string
    unit: string
    notes?: string
  }>
  instructions: Array<{
    stepNumber: number
    description: string
  }>
}

export default function RecipePreviewPage() {
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [rating, setRating] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const savedRecipe = sessionStorage.getItem('generatedRecipe')
    if (savedRecipe) {
      try {
        setRecipe(JSON.parse(savedRecipe))
      } catch (error) {
        console.error('Error parsing saved recipe:', error)
        toast.error('Error loading recipe')
        router.push('/')
      }
    } else {
      router.push('/')
    }
  }, [router])

  const handleSaveRecipe = async () => {
    if (!recipe) return

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      })

      if (response.ok) {
        const { recipe: savedRecipe } = await response.json()
        toast.success('Recipe saved successfully!')
        sessionStorage.removeItem('generatedRecipe')
        router.push(`/recipes/${savedRecipe.id}`)
      } else {
        throw new Error('Failed to save recipe')
      }
    } catch (error) {
      console.error('Error saving recipe:', error)
      toast.error('Failed to save recipe')
    }
  }

  const handleShare = async () => {
    if (navigator.share && recipe) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        toast.success('Recipe link copied to clipboard!')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Recipe link copied to clipboard!')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'EASY': return 'text-green-600 bg-green-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'HARD': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    )
  }

  const totalTime = recipe.prepTime + recipe.cookTime

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Recipe Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h1>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              
              {/* Recipe Meta */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <ClockIcon className="w-5 h-5" />
                  <span>{totalTime} min total</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <UsersIcon className="w-5 h-5" />
                  <span>{recipe.servings} servings</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              </div>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    isFavorite
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-700'
                  }`}
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </button>
                
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <ShareIcon className="w-5 h-5" />
                  Share
                </button>
                
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-colors"
                >
                  <PrinterIcon className="w-5 h-5" />
                  Print
                </button>
              </div>
            </div>

            {/* Nutrition Info */}
            <div className="md:w-64 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-orange-500" />
                Nutrition (per serving)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-medium">{recipe.calories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-medium">{recipe.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbs</span>
                  <span className="font-medium">{recipe.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fat</span>
                  <span className="font-medium">{recipe.fat}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </div>
                  {ingredient.notes && (
                    <div className="text-sm text-gray-600 mt-1">{ingredient.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
          <div className="space-y-6">
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {instruction.stepNumber}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 leading-relaxed">{instruction.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate this Recipe</h2>
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setUserRating(star)}
                className={`w-8 h-8 ${
                  star <= userRating
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-400'
                } transition-colors`}
              >
                <StarIcon className="w-full h-full fill-current" />
              </button>
            ))}
            <span className="ml-2 text-gray-600">
              {userRating > 0 ? `${userRating} star${userRating > 1 ? 's' : ''}` : 'Rate this recipe'}
            </span>
          </div>
        </div>

        {/* Save Recipe Button */}
        <div className="text-center">
          <button
            onClick={handleSaveRecipe}
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            <HeartIcon className="w-5 h-5" />
            Save Recipe to Collection
          </button>
        </div>
      </div>
    </div>
  )
}

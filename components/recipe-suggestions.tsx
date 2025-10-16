'use client'

import { useState, useEffect } from 'react'
import { Recipe } from '@/types/recipe'
import { RecipeCard } from './recipe-card'
import { 
  SparklesIcon, 
  ClockIcon, 
  FireIcon, 
  StarIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline'

interface RecipeSuggestionsProps {
  userPreferences?: {
    favoriteIngredients?: string[]
    dietaryRestrictions?: string[]
    favoriteCuisines?: string[]
    preferredDifficulty?: string[]
    ratingThreshold?: number
  }
  className?: string
}

interface SuggestionCategory {
  title: string
  description: string
  icon: React.ReactNode
  recipes: Recipe[]
}

export function RecipeSuggestions({ 
  userPreferences = {}, 
  className = '' 
}: RecipeSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestionCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSuggestions()
  }, [userPreferences])

  const loadSuggestions = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch from your API
      // For now, we'll simulate with predefined data
      const mockSuggestions = await generateMockSuggestions(userPreferences)
      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error('Error loading suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockSuggestions = async (preferences: any): Promise<SuggestionCategory[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // This would normally come from your backend based on user preferences
    return [
      {
        title: "Based on Your Favorites",
        description: "Recipes similar to ones you've rated highly",
        icon: <StarIcon className="w-6 h-6" />,
        recipes: [
          {
            id: "1",
            title: "Creamy Mushroom Risotto",
            description: "Rich and creamy Italian risotto with wild mushrooms",
            prepTime: 15,
            cookTime: 30,
            servings: 4,
            difficulty: "MEDIUM" as const,
            category: "MAIN_COURSE" as const,
            cuisine: "Italian",
            tags: ["vegetarian", "comfort-food"],
            calories: 420,
            protein: 16,
            carbs: 55,
            fat: 14,
            imageUrl: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            authorId: "1",
            ingredients: [],
            instructions: []
          },
          {
            id: "2",
            title: "Thai Basil Chicken",
            description: "Spicy Thai stir-fry with aromatic basil",
            prepTime: 15,
            cookTime: 10,
            servings: 4,
            difficulty: "EASY" as const,
            category: "MAIN_COURSE" as const,
            cuisine: "Thai",
            tags: ["spicy", "quick"],
            calories: 280,
            protein: 25,
            carbs: 8,
            fat: 16,
            imageUrl: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            authorId: "1",
            ingredients: [],
            instructions: []
          }
        ]
      },
      {
        title: "Quick & Easy",
        description: "Perfect for busy weeknights",
        icon: <ClockIcon className="w-6 h-6" />,
        recipes: [
          {
            id: "3",
            title: "15-Minute Pasta",
            description: "Quick pasta dish ready in minutes",
            prepTime: 5,
            cookTime: 10,
            servings: 2,
            difficulty: "EASY" as const,
            category: "MAIN_COURSE" as const,
            cuisine: "Italian",
            tags: ["quick", "simple"],
            calories: 350,
            protein: 14,
            carbs: 45,
            fat: 12,
            imageUrl: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            authorId: "1",
            ingredients: [],
            instructions: []
          }
        ]
      },
      {
        title: "Healthy Options",
        description: "Nutritious recipes for a balanced diet",
        icon: <FireIcon className="w-6 h-6" />,
        recipes: [
          {
            id: "4",
            title: "Mediterranean Quinoa Bowl",
            description: "Healthy bowl with quinoa and fresh vegetables",
            prepTime: 20,
            cookTime: 15,
            servings: 4,
            difficulty: "EASY" as const,
            category: "MAIN_COURSE" as const,
            cuisine: "Mediterranean",
            tags: ["healthy", "vegetarian"],
            calories: 380,
            protein: 12,
            carbs: 45,
            fat: 18,
            imageUrl: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            authorId: "1",
            ingredients: [],
            instructions: []
          }
        ]
      }
    ]
  }

  const getPersonalizedMessage = () => {
    const { favoriteCuisines, dietaryRestrictions } = userPreferences
    
    if (favoriteCuisines && favoriteCuisines.length > 0) {
      return `We've curated these recipes based on your love for ${favoriteCuisines.join(', ')} cuisine`
    }
    
    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
      return `Here are recipes that fit your ${dietaryRestrictions.join(', ')} dietary preferences`
    }
    
    return "Discover new recipes tailored just for you"
  }

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding perfect recipes for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <SparklesIcon className="w-8 h-8 text-primary-500" />
          <h2 className="text-3xl font-bold text-gray-900">Recipe Suggestions</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {getPersonalizedMessage()}
        </p>
        <button
          onClick={loadSuggestions}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Refresh Suggestions
        </button>
      </div>

      {/* Suggestion Categories */}
      {suggestions.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
              {category.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Show More Button */}
          {category.recipes.length > 0 && (
            <div className="text-center">
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                View More {category.title.toLowerCase()}
              </button>
            </div>
          )}
        </div>
      ))}

      {/* No Suggestions State */}
      {suggestions.length === 0 && (
        <div className="text-center py-12">
          <SparklesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No suggestions available
          </h3>
          <p className="text-gray-600 mb-6">
            Rate some recipes or add your preferences to get personalized suggestions
          </p>
          <button
            onClick={loadSuggestions}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Try Again
          </button>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💡 Get Better Suggestions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Rate More Recipes</h4>
            <p>Help us learn your taste preferences by rating recipes you try</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Set Your Preferences</h4>
            <p>Update your dietary restrictions and favorite cuisines for better matches</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Save Your Favorites</h4>
            <p>Mark recipes as favorites to help us understand what you love</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Write Reviews</h4>
            <p>Share detailed feedback to get more accurate recommendations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

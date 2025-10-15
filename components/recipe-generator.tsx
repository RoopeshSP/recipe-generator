'use client'

import { useState } from 'react'
import { SparklesIcon, ClockIcon, UsersIcon, StarIcon, FireIcon } from '@heroicons/react/24/outline'
import { generateRecipe } from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { IngredientInput } from './ingredient-input'

interface RecipeGeneratorProps {
  onGenerated?: () => void
}

interface Ingredient {
  name: string
  amount?: string
  unit?: string
}

const CUISINE_OPTIONS = [
  'Any', 'Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean', 'American',
  'French', 'Thai', 'Chinese', 'Japanese', 'Greek', 'Spanish', 'Middle Eastern'
]

const DIFFICULTY_OPTIONS = [
  { value: 'EASY', label: 'Easy', description: 'Simple recipes with basic techniques' },
  { value: 'MEDIUM', label: 'Medium', description: 'Moderate complexity with some skill required' },
  { value: 'HARD', label: 'Hard', description: 'Advanced techniques and longer prep time' }
]

const SERVING_OPTIONS = [1, 2, 4, 6, 8, 10, 12]

export function RecipeGenerator({ onGenerated }: RecipeGeneratorProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
  const [cuisine, setCuisine] = useState('Any')
  const [difficulty, setDifficulty] = useState('EASY')
  const [servings, setServings] = useState(4)
  const [cookingTime, setCookingTime] = useState<number | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      toast.error('Please add at least one ingredient')
      return
    }

    try {
      setIsGenerating(true)
      
      // Build the prompt with all user inputs
      const ingredientList = ingredients.map(ing => ing.name).join(', ')
      const dietaryList = dietaryPreferences.length > 0 
        ? `Dietary preferences: ${dietaryPreferences.join(', ')}. ` 
        : ''
      
      const timeConstraint = cookingTime 
        ? `Total cooking time should be approximately ${cookingTime} minutes or less. ` 
        : ''
      
      const prompt = `Create a recipe using these ingredients: ${ingredientList}. ${dietaryList}${timeConstraint}Cuisine style: ${cuisine}. Difficulty level: ${difficulty}. Serving size: ${servings} people. Make sure the recipe is practical, well-seasoned, and includes detailed step-by-step instructions.`

      const aiRecipe = await generateRecipe(prompt, {
        dietaryRestrictions: dietaryPreferences.join(', '),
        cuisine: cuisine === 'Any' ? undefined : cuisine,
        difficulty,
        servings
      })

      // Navigate to a preview page or show the recipe
      toast.success('Recipe generated successfully!')
      onGenerated?.()
      
      // For now, we'll store in sessionStorage and navigate to a preview
      sessionStorage.setItem('generatedRecipe', JSON.stringify(aiRecipe))
      router.push('/recipes/preview')
      
    } catch (error: any) {
      console.error('Error generating recipe:', error)
      toast.error(error?.message || 'Failed to generate recipe. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const canGenerate = ingredients.length > 0 && !isGenerating

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Smart Recipe Generator
        </h2>
        <p className="text-gray-600">
          Tell us what ingredients you have, and we'll create a personalized recipe just for you
        </p>
      </div>

      <div className="space-y-8">
        {/* Ingredient Input and Dietary Preferences */}
        <IngredientInput
          ingredients={ingredients}
          onIngredientsChange={setIngredients}
          dietaryPreferences={dietaryPreferences}
          onDietaryPreferencesChange={setDietaryPreferences}
        />

        {/* Recipe Customization Options */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Customize Your Recipe</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cuisine Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cuisine Style
              </label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {CUISINE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {DIFFICULTY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                {DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty)?.description}
              </p>
            </div>

            {/* Servings */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <UsersIcon className="inline w-4 h-4 mr-1" />
                Servings
              </label>
              <select
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {SERVING_OPTIONS.map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'person' : 'people'}
                  </option>
                ))}
              </select>
            </div>

            {/* Cooking Time Limit */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <ClockIcon className="inline w-4 h-4 mr-1" />
                Max Cooking Time
              </label>
              <select
                value={cookingTime || ''}
                onChange={(e) => setCookingTime(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">No limit</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recipe Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-gray-900">Recipe Summary:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Ingredients:</strong> {ingredients.length} selected</p>
            <p><strong>Cuisine:</strong> {cuisine}</p>
            <p><strong>Difficulty:</strong> {DIFFICULTY_OPTIONS.find(opt => opt.value === difficulty)?.label}</p>
            <p><strong>Servings:</strong> {servings}</p>
            {cookingTime && <p><strong>Time limit:</strong> {cookingTime} minutes</p>}
            {dietaryPreferences.length > 0 && (
              <p><strong>Dietary:</strong> {dietaryPreferences.join(', ')}</p>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerateRecipe}
            disabled={!canGenerate}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 ${
              canGenerate
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <SparklesIcon className="w-6 h-6" />
            {isGenerating ? 'Generating Recipe...' : 'Generate Recipe'}
          </button>
          
          {!canGenerate && ingredients.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Add ingredients to get started
            </p>
          )}
        </div>
      </div>

      {/* Features Preview */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FireIcon className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">AI-Powered</h4>
          <p className="text-sm text-gray-600">
            Advanced AI creates personalized recipes based on your preferences
          </p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <StarIcon className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Dietary Friendly</h4>
          <p className="text-sm text-gray-600">
            Supports all major dietary restrictions and preferences
          </p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ClockIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Time-Conscious</h4>
          <p className="text-sm text-gray-600">
            Set time limits to get recipes that fit your schedule
          </p>
        </div>
      </div>
    </div>
  )
}

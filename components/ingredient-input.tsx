'use client'

import { useState, useRef, useEffect } from 'react'
import { PlusIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface Ingredient {
  name: string
  amount?: string
  unit?: string
}

interface DietaryPreference {
  id: string
  label: string
  description: string
}

const COMMON_INGREDIENTS = [
  'chicken', 'beef', 'pork', 'fish', 'salmon', 'shrimp', 'eggs', 'milk', 'cheese',
  'onion', 'garlic', 'tomato', 'potato', 'carrot', 'bell pepper', 'mushroom',
  'rice', 'pasta', 'bread', 'flour', 'sugar', 'salt', 'pepper', 'olive oil',
  'butter', 'lemon', 'lime', 'basil', 'oregano', 'thyme', 'parsley',
  'chickpeas', 'black beans', 'lentils', 'quinoa', 'oats', 'almonds',
  'spinach', 'broccoli', 'cauliflower', 'zucchini', 'eggplant', 'avocado'
]

const DIETARY_PREFERENCES: DietaryPreference[] = [
  { id: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
  { id: 'vegan', label: 'Vegan', description: 'No animal products' },
  { id: 'gluten-free', label: 'Gluten-Free', description: 'No gluten-containing ingredients' },
  { id: 'dairy-free', label: 'Dairy-Free', description: 'No dairy products' },
  { id: 'nut-free', label: 'Nut-Free', description: 'No nuts or tree nuts' },
  { id: 'low-carb', label: 'Low-Carb', description: 'Minimal carbohydrates' },
  { id: 'keto', label: 'Keto', description: 'Ketogenic diet friendly' },
  { id: 'paleo', label: 'Paleo', description: 'Paleolithic diet friendly' },
  { id: 'low-sodium', label: 'Low-Sodium', description: 'Reduced sodium content' },
  { id: 'halal', label: 'Halal', description: 'Halal compliant ingredients' },
  { id: 'kosher', label: 'Kosher', description: 'Kosher compliant ingredients' }
]

interface IngredientInputProps {
  ingredients: Ingredient[]
  onIngredientsChange: (ingredients: Ingredient[]) => void
  dietaryPreferences: string[]
  onDietaryPreferencesChange: (preferences: string[]) => void
  className?: string
}

export function IngredientInput({
  ingredients,
  onIngredientsChange,
  dietaryPreferences,
  onDietaryPreferencesChange,
  className = ''
}: IngredientInputProps) {
  const [newIngredient, setNewIngredient] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = COMMON_INGREDIENTS.filter(ingredient =>
        ingredient.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ingredients.some(ing => ing.name.toLowerCase() === ingredient.toLowerCase())
      )
      setFilteredSuggestions(filtered.slice(0, 8))
      setShowSuggestions(filtered.length > 0)
    } else {
      setFilteredSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery, ingredients])

  const addIngredient = (ingredientName: string) => {
    if (ingredientName.trim() && !ingredients.some(ing => ing.name.toLowerCase() === ingredientName.toLowerCase())) {
      onIngredientsChange([...ingredients, { name: ingredientName.trim() }])
      setNewIngredient('')
      setSearchQuery('')
      setShowSuggestions(false)
    }
  }

  const removeIngredient = (index: number) => {
    onIngredientsChange(ingredients.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredSuggestions.length > 0) {
        addIngredient(filteredSuggestions[0])
      } else if (newIngredient.trim()) {
        addIngredient(newIngredient)
      }
    }
  }

  const toggleDietaryPreference = (preferenceId: string) => {
    if (dietaryPreferences.includes(preferenceId)) {
      onDietaryPreferencesChange(dietaryPreferences.filter(id => id !== preferenceId))
    } else {
      onDietaryPreferencesChange([...dietaryPreferences, preferenceId])
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Ingredient Input Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Available Ingredients</h3>
          <span className="text-sm text-gray-500">{ingredients.length} ingredients</span>
        </div>

        {/* Ingredient Input */}
        <div className="relative">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={newIngredient}
              onChange={(e) => {
                setNewIngredient(e.target.value)
                setSearchQuery(e.target.value)
              }}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                if (searchQuery.trim()) {
                  setShowSuggestions(true)
                }
              }}
              placeholder="Type ingredient name or search..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {newIngredient && (
              <button
                type="button"
                onClick={() => addIngredient(newIngredient)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-primary-600 hover:text-primary-800"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredSuggestions.map((ingredient, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addIngredient(ingredient)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  {ingredient}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Ingredients */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Ingredients:</h4>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
              >
                {ingredient.name}
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          {ingredients.length === 0 && (
            <p className="text-sm text-gray-500 italic">No ingredients selected yet</p>
          )}
        </div>

        {/* Quick Add Common Ingredients */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Quick Add:</h4>
          <div className="flex flex-wrap gap-2">
            {['chicken', 'rice', 'onion', 'garlic', 'tomato', 'cheese', 'eggs', 'pasta'].map((ingredient) => (
              <button
                key={ingredient}
                type="button"
                onClick={() => addIngredient(ingredient)}
                disabled={ingredients.some(ing => ing.name.toLowerCase() === ingredient.toLowerCase())}
                className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dietary Preferences Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Dietary Preferences</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select any dietary restrictions or preferences to customize your recipe suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DIETARY_PREFERENCES.map((preference) => (
            <label
              key={preference.id}
              className={`relative flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                dietaryPreferences.includes(preference.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="checkbox"
                checked={dietaryPreferences.includes(preference.id)}
                onChange={() => toggleDietaryPreference(preference.id)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-900">
                  {preference.label}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {preference.description}
                </div>
              </div>
              <div
                className={`ml-2 w-4 h-4 border-2 rounded ${
                  dietaryPreferences.includes(preference.id)
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                }`}
              >
                {dietaryPreferences.includes(preference.id) && (
                  <svg className="w-3 h-3 text-white mt-0.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </label>
          ))}
        </div>

        {dietaryPreferences.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Selected Preferences:</h4>
            <div className="flex flex-wrap gap-2">
              {dietaryPreferences.map((preferenceId) => {
                const preference = DIETARY_PREFERENCES.find(p => p.id === preferenceId)
                return (
                  <span
                    key={preferenceId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {preference?.label}
                    <button
                      type="button"
                      onClick={() => toggleDietaryPreference(preferenceId)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

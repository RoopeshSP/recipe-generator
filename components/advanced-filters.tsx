'use client'

import { useState } from 'react'
import { 
  FunnelIcon, 
  ClockIcon, 
  UsersIcon, 
  StarIcon,
  FireIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

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

interface AdvancedFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
  className?: string
}

const DIFFICULTY_OPTIONS = [
  { value: 'EASY', label: 'Easy', color: 'green' },
  { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
  { value: 'HARD', label: 'Hard', color: 'red' }
]

const CUISINE_OPTIONS = [
  'Italian', 'Mexican', 'Asian', 'Indian', 'Mediterranean', 'American',
  'French', 'Thai', 'Chinese', 'Japanese', 'Greek', 'Spanish', 'Middle Eastern'
]

const DIETARY_OPTIONS = [
  'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free',
  'low-carb', 'keto', 'paleo', 'low-sodium', 'halal', 'kosher'
]

const COOKING_TIME_RANGES = [
  { label: 'Quick (≤ 15 min)', min: 0, max: 15 },
  { label: 'Fast (≤ 30 min)', min: 0, max: 30 },
  { label: 'Medium (≤ 60 min)', min: 0, max: 60 },
  { label: 'Long (> 60 min)', min: 60, max: null }
]

const CALORIE_RANGES = [
  { label: 'Light (≤ 300)', min: 0, max: 300 },
  { label: 'Moderate (300-500)', min: 300, max: 500 },
  { label: 'Hearty (500-700)', min: 500, max: 700 },
  { label: 'Rich (> 700)', min: 700, max: null }
]

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  className = ''
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleArrayFilter = (key: keyof FilterOptions, value: string) => {
    const currentArray = filters[key] as string[]
    if (currentArray.includes(value)) {
      updateFilters({ [key]: currentArray.filter(item => item !== value) })
    } else {
      updateFilters({ [key]: [...currentArray, value] })
    }
  }

  const setTimeRange = (min: number | null, max: number | null) => {
    updateFilters({
      cookingTime: { min, max }
    })
  }

  const setCalorieRange = (min: number | null, max: number | null) => {
    updateFilters({
      calories: { min, max }
    })
  }

  const hasActiveFilters = () => {
    return (
      filters.difficulty.length > 0 ||
      filters.dietaryRestrictions.length > 0 ||
      filters.cuisine.length > 0 ||
      filters.rating !== null ||
      filters.cookingTime.min !== null ||
      filters.cookingTime.max !== null ||
      filters.calories.min !== null ||
      filters.calories.max !== null
    )
  }

  const getActiveFilterCount = () => {
    let count = 0
    count += filters.difficulty.length
    count += filters.dietaryRestrictions.length
    count += filters.cuisine.length
    if (filters.rating !== null) count++
    if (filters.cookingTime.min !== null || filters.cookingTime.max !== null) count++
    if (filters.calories.min !== null || filters.calories.max !== null) count++
    return count
  }

  return (
    <div className={`${className}`}>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          hasActiveFilters()
            ? 'border-primary-500 bg-primary-50 text-primary-700'
            : 'border-gray-300 hover:border-gray-400 text-gray-700'
        }`}
      >
        <FunnelIcon className="w-5 h-5" />
        Filters
        {hasActiveFilters() && (
          <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5">
            {getActiveFilterCount()}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="mt-4 p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filter Recipes</h3>
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <XMarkIcon className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Difficulty Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <StarIcon className="w-4 h-4" />
                Difficulty
              </h4>
              <div className="space-y-2">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(option.value)}
                      onChange={() => toggleArrayFilter('difficulty', option.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 border-2 rounded mr-2 cursor-pointer ${
                        filters.difficulty.includes(option.value)
                          ? `border-${option.color}-500 bg-${option.color}-500`
                          : 'border-gray-300'
                      }`}
                    >
                      {filters.difficulty.includes(option.value) && (
                        <svg className="w-3 h-3 text-white mt-0.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cooking Time Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                Cooking Time
              </h4>
              <div className="space-y-2">
                {COOKING_TIME_RANGES.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setTimeRange(range.min, range.max)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.cookingTime.min === range.min && filters.cookingTime.max === range.max
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Cuisine</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {CUISINE_OPTIONS.map((cuisine) => (
                  <label key={cuisine} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.cuisine.includes(cuisine)}
                      onChange={() => toggleArrayFilter('cuisine', cuisine)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 border-2 rounded mr-2 cursor-pointer ${
                        filters.cuisine.includes(cuisine)
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {filters.cuisine.includes(cuisine) && (
                        <svg className="w-3 h-3 text-white mt-0.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700">{cuisine}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dietary Restrictions Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Dietary</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {DIETARY_OPTIONS.map((diet) => (
                  <label key={diet} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.dietaryRestrictions.includes(diet)}
                      onChange={() => toggleArrayFilter('dietaryRestrictions', diet)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 border-2 rounded mr-2 cursor-pointer ${
                        filters.dietaryRestrictions.includes(diet)
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {filters.dietaryRestrictions.includes(diet) && (
                        <svg className="w-3 h-3 text-white mt-0.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700 capitalize">{diet.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Calories Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <FireIcon className="w-4 h-4" />
                Calories
              </h4>
              <div className="space-y-2">
                {CALORIE_RANGES.map((range, index) => (
                  <button
                    key={index}
                    onClick={() => setCalorieRange(range.min, range.max)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.calories.min === range.min && filters.calories.max === range.max
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <StarIcon className="w-4 h-4" />
                Minimum Rating
              </h4>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => updateFilters({ rating: filters.rating === rating ? null : rating })}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      filters.rating !== null && rating <= filters.rating
                        ? 'border-yellow-400 bg-yellow-400'
                        : 'border-gray-300 hover:border-yellow-400'
                    }`}
                  >
                    <StarIcon className={`w-4 h-4 mx-auto ${
                      filters.rating !== null && rating <= filters.rating
                        ? 'text-white fill-current'
                        : 'text-gray-400'
                    }`} />
                  </button>
                ))}
                {filters.rating && (
                  <span className="text-sm text-gray-600 ml-2">
                    {filters.rating}+ stars
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters() && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.difficulty.map((diff) => (
                  <span key={diff} className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {diff} difficulty
                  </span>
                ))}
                {filters.cuisine.map((cuisine) => (
                  <span key={cuisine} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {cuisine}
                  </span>
                ))}
                {filters.dietaryRestrictions.map((diet) => (
                  <span key={diet} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {diet.replace('-', ' ')}
                  </span>
                ))}
                {filters.rating && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    {filters.rating}+ stars
                  </span>
                )}
                {(filters.cookingTime.min !== null || filters.cookingTime.max !== null) && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Time filtered
                  </span>
                )}
                {(filters.calories.min !== null || filters.calories.max !== null) && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    Calories filtered
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'

const categories = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'LUNCH', label: 'Lunch' },
  { value: 'DINNER', label: 'Dinner' },
  { value: 'DESSERT', label: 'Dessert' },
  { value: 'SNACK', label: 'Snack' },
  { value: 'BEVERAGE', label: 'Beverage' },
  { value: 'APPETIZER', label: 'Appetizer' },
  { value: 'SOUP', label: 'Soup' },
  { value: 'SALAD', label: 'Salad' },
  { value: 'MAIN_COURSE', label: 'Main Course' },
  { value: 'SIDE_DISH', label: 'Side Dish' },
]

interface CategoryFilterProps {
  onCategoryChange?: (category: string) => void
}

export function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    onCategoryChange?.(category)
  }

  return (
    <div className="w-full md:w-auto">
      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="input-field py-3 w-full md:w-48"
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  )
}

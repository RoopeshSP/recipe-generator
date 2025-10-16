'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RecipeForm } from '../../components/recipe-form'
import { CreateRecipeInput } from '../../types/recipe'
import toast from 'react-hot-toast'

export default function CreateRecipePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (recipeData: CreateRecipeInput) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      })

      if (!response.ok) {
        throw new Error('Failed to create recipe')
      }

      const { recipe } = await response.json()
      toast.success('Recipe created successfully!')
      router.push(`/recipes/${recipe.id}`)
    } catch (error) {
      console.error('Error creating recipe:', error)
      toast.error('Failed to create recipe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Recipe
          </h1>
          <p className="text-gray-600">
            Share your culinary creation with the world
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <RecipeForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}

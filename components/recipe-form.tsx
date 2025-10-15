'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { CreateRecipeInput } from '@/types/recipe'
import type { Category, Difficulty } from '@prisma/client'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface RecipeFormProps {
  onSubmit: (data: CreateRecipeInput) => void
  isSubmitting?: boolean
  initialData?: Partial<CreateRecipeInput>
}

export function RecipeForm({ onSubmit, isSubmitting = false, initialData }: RecipeFormProps) {
  const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateRecipeInput>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      prepTime: initialData?.prepTime || 15,
      cookTime: initialData?.cookTime || 15,
      servings: initialData?.servings || 4,
      difficulty: initialData?.difficulty || 'EASY',
      category: initialData?.category || 'MAIN_COURSE',
      cuisine: initialData?.cuisine || '',
      tags: initialData?.tags || [],
      calories: initialData?.calories || undefined,
      protein: initialData?.protein || undefined,
      carbs: initialData?.carbs || undefined,
      fat: initialData?.fat || undefined,
      ingredients: initialData?.ingredients || [{ name: '', amount: '', unit: '', notes: '' }],
      instructions: initialData?.instructions || [{ stepNumber: 1, description: '' }],
    },
  })

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients',
  })

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control,
    name: 'instructions',
  })

  const [tagsInput, setTagsInput] = useState('')

  const handleTagsInput = (value: string) => {
    setTagsInput(value)
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    // Update the form with the tags
    setValue('tags', tags, { shouldDirty: true })
  }

  const addTag = () => {
    if (tagsInput.trim()) {
      const newTag = tagsInput.trim()
      setTagsInput('')
      const currentTags = watch('tags') || []
      setValue('tags', [...currentTags, newTag], { shouldDirty: true })
    }
  }

  const removeTag = (indexToRemove: number) => {
    const currentTags = watch('tags') || []
    setValue('tags', currentTags.filter((_, index) => index !== indexToRemove), { shouldDirty: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Title *
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="input-field"
              placeholder="e.g., Classic Margherita Pizza"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine
            </label>
            <input
              {...register('cuisine')}
              className="input-field"
              placeholder="e.g., Italian, Thai, Mexican"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="input-field"
            placeholder="Describe your recipe..."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prep Time (min) *
            </label>
            <input
              {...register('prepTime', { required: 'Prep time is required', min: 1 })}
              type="number"
              className="input-field"
              min="1"
            />
            {errors.prepTime && (
              <p className="text-red-500 text-sm mt-1">{errors.prepTime.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cook Time (min) *
            </label>
            <input
              {...register('cookTime', { required: 'Cook time is required', min: 1 })}
              type="number"
              className="input-field"
              min="1"
            />
            {errors.cookTime && (
              <p className="text-red-500 text-sm mt-1">{errors.cookTime.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servings *
            </label>
            <input
              {...register('servings', { required: 'Servings is required', min: 1 })}
              type="number"
              className="input-field"
              min="1"
            />
            {errors.servings && (
              <p className="text-red-500 text-sm mt-1">{errors.servings.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty *
            </label>
            <select {...register('difficulty', { required: 'Difficulty is required' })} className="input-field">
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select {...register('category', { required: 'Category is required' })} className="input-field">
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="DESSERT">Dessert</option>
            <option value="SNACK">Snack</option>
            <option value="BEVERAGE">Beverage</option>
            <option value="APPETIZER">Appetizer</option>
            <option value="SOUP">Soup</option>
            <option value="SALAD">Salad</option>
            <option value="MAIN_COURSE">Main Course</option>
            <option value="SIDE_DISH">Side Dish</option>
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="input-field flex-1"
              placeholder="Add tags separated by commas"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              onClick={addTag}
              className="btn-secondary"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(watch('tags') || []).map((tag, index) => (
              <span
                key={index}
                className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-primary-500 hover:text-primary-700"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Ingredients</h2>
          <button
            type="button"
            onClick={() => appendIngredient({ name: '', amount: '', unit: '', notes: '' })}
            className="btn-secondary flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Ingredient
          </button>
        </div>

        <div className="space-y-4">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  {...register(`ingredients.${index}.amount`, { required: 'Amount is required' })}
                  className="input-field"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  {...register(`ingredients.${index}.unit`)}
                  className="input-field"
                  placeholder="cups"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingredient *
                </label>
                <input
                  {...register(`ingredients.${index}.name`, { required: 'Ingredient name is required' })}
                  className="input-field"
                  placeholder="flour"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <input
                    {...register(`ingredients.${index}.notes`)}
                    className="input-field"
                    placeholder="optional"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Instructions</h2>
          <button
            type="button"
            onClick={() => appendInstruction({ stepNumber: instructionFields.length + 1, description: '' })}
            className="btn-secondary flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Step
          </button>
        </div>

        <div className="space-y-4">
          {instructionFields.map((field, index) => (
            <div key={field.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <textarea
                  {...register(`instructions.${index}.description`, { required: 'Step description is required' })}
                  rows={3}
                  className="input-field w-full"
                  placeholder="Describe this step in detail..."
                />
              </div>
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="text-red-500 hover:text-red-700 p-2 flex-shrink-0"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition (Optional) */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Nutrition Information (Optional)</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calories (per serving)
            </label>
            <input
              {...register('calories', { valueAsNumber: true })}
              type="number"
              className="input-field"
              placeholder="350"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Protein (g)
            </label>
            <input
              {...register('protein', { valueAsNumber: true })}
              type="number"
              step="0.1"
              className="input-field"
              placeholder="15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carbs (g)
            </label>
            <input
              {...register('carbs', { valueAsNumber: true })}
              type="number"
              step="0.1"
              className="input-field"
              placeholder="45"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fat (g)
            </label>
            <input
              {...register('fat', { valueAsNumber: true })}
              type="number"
              step="0.1"
              className="input-field"
              placeholder="12"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Recipe'}
        </button>
      </div>
    </form>
  )
}

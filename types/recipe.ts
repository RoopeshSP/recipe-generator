import { Category, Difficulty } from '@prisma/client'

export interface Recipe {
  id: string
  title: string
  description?: string
  imageUrl?: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: Difficulty
  category: Category
  cuisine?: string
  tags: string[]
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  ingredients: Ingredient[]
  instructions: Instruction[]
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface Ingredient {
  id: string
  name: string
  amount: string
  unit?: string
  notes?: string
  recipeId: string
}

export interface Instruction {
  id: string
  stepNumber: number
  description: string
  imageUrl?: string
  recipeId: string
}

export interface User {
  id: string
  email: string
  name?: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateRecipeInput {
  title: string
  description?: string
  imageUrl?: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: Difficulty
  category: Category
  cuisine?: string
  tags: string[]
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  ingredients: Omit<Ingredient, 'id' | 'recipeId'>[]
  instructions: Omit<Instruction, 'id' | 'recipeId'>[]
}

export interface UpdateRecipeInput extends Partial<CreateRecipeInput> {
  id: string
}

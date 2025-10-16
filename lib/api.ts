import { Recipe } from '../types/recipe'

function getApiBase() {
  // In browser use relative URLs; on server, prefer configured base
  if (typeof window !== 'undefined') return ''
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000'
  )
}

function apiUrl(path: string) {
  const base = getApiBase()
  if (!base) return path
  return `${base}${path}`
}

export async function getRecipes(params?: {
  category?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<Recipe[]> {
  const searchParams = new URLSearchParams()
  
  if (params?.category) searchParams.set('category', params.category)
  if (params?.search) searchParams.set('search', params.search)
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.offset) searchParams.set('offset', params.offset.toString())

  const url = apiUrl(`/api/recipes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)
  
  const response = await fetch(url, {
    next: { revalidate: 60 }, // Revalidate every minute
  })

  if (!response.ok) {
    throw new Error('Failed to fetch recipes')
  }

  const data = await response.json()
  return data.recipes
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const response = await fetch(apiUrl(`/api/recipes/${id}`), {
    next: { revalidate: 60 }, // Revalidate every minute
  })

  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error('Failed to fetch recipe')
  }

  const data = await response.json()
  return data.recipe
}

export async function createRecipe(recipeData: any): Promise<Recipe> {
  const response = await fetch(apiUrl(`/api/recipes`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipeData),
  })

  if (!response.ok) {
    throw new Error('Failed to create recipe')
  }

  const data = await response.json()
  return data.recipe
}

export async function updateRecipe(id: string, recipeData: any): Promise<Recipe> {
  const response = await fetch(apiUrl(`/api/recipes/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipeData),
  })

  if (!response.ok) {
    throw new Error('Failed to update recipe')
  }

  const data = await response.json()
  return data.recipe
}

export async function deleteRecipe(id: string): Promise<void> {
  const response = await fetch(apiUrl(`/api/recipes/${id}`), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete recipe')
  }
}

export async function generateRecipe(prompt: string, options?: {
  dietaryRestrictions?: string
  cuisine?: string
  difficulty?: string
  servings?: number
}): Promise<Recipe> {
  const response = await fetch(apiUrl(`/api/ai/generate-recipe`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      ...options,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate recipe')
  }

  const data = await response.json()
  return data.recipe
}

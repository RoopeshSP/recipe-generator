import { notFound } from 'next/navigation'
import { RecipeDetail } from '@/components/recipe-detail'
import { getRecipe } from '@/lib/api'

interface RecipePageProps {
  params: {
    id: string
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  try {
    const recipe = await getRecipe(params.id)
    
    if (!recipe) {
      notFound()
    }

    return <RecipeDetail recipe={recipe} />
  } catch (error) {
    console.error('Error fetching recipe:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: RecipePageProps) {
  try {
    const recipe = await getRecipe(params.id)
    
    return {
      title: recipe?.title || 'Recipe Not Found',
      description: recipe?.description || 'Recipe not found',
    }
  } catch (error) {
    return {
      title: 'Recipe Not Found',
    }
  }
}

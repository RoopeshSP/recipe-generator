import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: params.id,
      },
      include: {
        ingredients: {
          orderBy: {
            id: 'asc',
          },
        },
        instructions: {
          orderBy: {
            stepNumber: 'asc',
          },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },
    })

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // TODO: Add authentication and authorization check
    const userId = 'temp-user-id' // Replace with actual user ID from auth

    // Check if user owns the recipe
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    })

    if (!existingRecipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    if (existingRecipe.authorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const recipe = await prisma.recipe.update({
      where: {
        id: params.id,
      },
      data: {
        ...body,
        ingredients: body.ingredients ? {
          deleteMany: {},
          create: body.ingredients,
        } : undefined,
        instructions: body.instructions ? {
          deleteMany: {},
          create: body.instructions,
        } : undefined,
      },
      include: {
        ingredients: true,
        instructions: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Error updating recipe:', error)
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication and authorization check
    const userId = 'temp-user-id' // Replace with actual user ID from auth

    // Check if user owns the recipe
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    })

    if (!existingRecipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    if (existingRecipe.authorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.recipe.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ message: 'Recipe deleted successfully' })
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    )
  }
}

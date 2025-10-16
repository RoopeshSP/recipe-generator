const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Import seed data
const { SEED_RECIPES } = require('../lib/seed-data.js')

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...')

    // Create a default user for the recipes
    const defaultUser = await prisma.user.upsert({
      where: { email: 'admin@recipegenerator.com' },
      update: {},
      create: {
        email: 'admin@recipegenerator.com',
        name: 'Recipe Generator Admin',
        password: 'hashedpassword123', // In production, this should be properly hashed
      },
    })

    console.log('✅ Default user created/found')

    // Clear existing recipes
    await prisma.recipe.deleteMany({})
    console.log('🧹 Cleared existing recipes')

    // Seed recipes
    for (const recipeData of SEED_RECIPES) {
      const recipe = await prisma.recipe.create({
        data: {
          title: recipeData.title,
          description: recipeData.description,
          prepTime: recipeData.prepTime,
          cookTime: recipeData.cookTime,
          servings: recipeData.servings,
          difficulty: recipeData.difficulty,
          category: recipeData.category,
          cuisine: recipeData.cuisine,
          tags: Array.isArray(recipeData.tags) ? recipeData.tags.join(', ') : recipeData.tags,
          calories: recipeData.calories,
          protein: recipeData.protein,
          carbs: recipeData.carbs,
          fat: recipeData.fat,
          authorId: defaultUser.id,
          ingredients: {
            create: recipeData.ingredients.map((ingredient, index) => ({
              name: ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
              notes: ingredient.notes || '',
            })),
          },
          instructions: {
            create: recipeData.instructions.map((instruction) => ({
              stepNumber: instruction.stepNumber,
              description: instruction.description,
            })),
          },
        },
      })
      console.log(`✅ Created recipe: ${recipe.title}`)
    }

    console.log(`🎉 Successfully seeded ${SEED_RECIPES.length} recipes!`)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Database seeding completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Database seeding failed:', error)
      process.exit(1)
    })
}

module.exports = { seedDatabase }

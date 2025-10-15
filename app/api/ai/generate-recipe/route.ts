import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, dietaryRestrictions, cuisine, difficulty, servings } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are a professional chef and recipe developer. Create a detailed recipe based on the user's request. 
    
    Format your response as a JSON object with the following structure:
    {
      "title": "Recipe Title",
      "description": "Brief description of the recipe",
      "prepTime": number (in minutes),
      "cookTime": number (in minutes),
      "servings": number,
      "difficulty": "EASY" | "MEDIUM" | "HARD",
      "category": "BREAKFAST" | "LUNCH" | "DINNER" | "DESSERT" | "SNACK" | "BEVERAGE" | "APPETIZER" | "SOUP" | "SALAD" | "MAIN_COURSE" | "SIDE_DISH",
      "cuisine": "cuisine type",
      "tags": ["tag1", "tag2", "tag3"],
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "ingredients": [
        {
          "name": "ingredient name",
          "amount": "amount",
          "unit": "unit",
          "notes": "optional notes"
        }
      ],
      "instructions": [
        {
          "stepNumber": 1,
          "description": "detailed step description"
        }
      ]
    }

    Consider these preferences:
    - Dietary restrictions: ${dietaryRestrictions || 'none'}
    - Cuisine: ${cuisine || 'any'}
    - Difficulty: ${difficulty || 'any'}
    - Servings: ${servings || '4'}

    Make sure the recipe is practical, well-seasoned, and includes proper cooking techniques.`

    const completion = await openai.chat.completions.create({
      // Use a widely-available lightweight model for free-tier compatibility
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let recipeData
    try {
      recipeData = JSON.parse(content)
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        recipeData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Could not parse recipe data from AI response')
      }
    }

    return NextResponse.json({ recipe: recipeData })
  } catch (error: any) {
    console.error('Error generating recipe:', error)

    // Graceful fallback for quota/availability issues or missing API key
    const message: string = error?.message || ''
    const code: string | undefined = error?.code || error?.error?.code
    const status: number | undefined = error?.status

    const isQuotaOrMissingKey =
      status === 429 ||
      code === 'insufficient_quota' ||
      code === 'invalid_api_key' ||
      message.toLowerCase().includes('quota') ||
      !process.env.OPENAI_API_KEY

    // Attempt secondary provider via OpenRouter if available
    if (isQuotaOrMissingKey && process.env.OPENROUTER_API_KEY) {
      try {
        const { prompt, dietaryRestrictions, cuisine, difficulty, servings } = await request.json()
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'mistralai/mixtral-8x7b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          const content = data?.choices?.[0]?.message?.content as string | undefined
          if (content) {
            try {
              const parsed = JSON.parse(content)
              return NextResponse.json({ recipe: parsed, note: 'Generated via OpenRouter fallback.' })
            } catch {
              const jsonMatch = content.match(/\{[\s\S]*\}/)
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                return NextResponse.json({ recipe: parsed, note: 'Generated via OpenRouter fallback.' })
              }
            }
          }
        }
      } catch (e) {
        console.warn('OpenRouter fallback failed:', e)
      }
    }

    if (isQuotaOrMissingKey) {
      const { prompt, dietaryRestrictions, cuisine, difficulty, servings } = await request.json().catch(() => ({ }))
      const fallback = buildFallbackRecipe(prompt || 'Custom Dish', {
        dietaryRestrictions, cuisine, difficulty, servings,
      })
      return NextResponse.json({ recipe: fallback, note: 'AI unavailable, returned fallback recipe.' }, { status: 200 })
    }

    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 })
  }
}

function buildFallbackRecipe(titleSeed: string, opts: any) {
  const baseTitle = titleSeed?.trim() ? titleCase(titleSeed).slice(0, 60) : 'Chef\'s Special'
  const category = normalizeCategory(opts?.category || 'DINNER')
  const difficulty = normalizeDifficulty(opts?.difficulty || 'EASY')
  const servings = Number(opts?.servings) || 4
  const tags: string[] = [opts?.cuisine?.toLowerCase(), opts?.dietaryRestrictions]?.filter(Boolean)

  return {
    title: baseTitle,
    description: `A tasty, easy-to-make ${opts?.cuisine || ''} dish generated as a fallback when AI is unavailable.`.trim(),
    prepTime: 15,
    cookTime: 20,
    servings,
    difficulty,
    category,
    cuisine: opts?.cuisine || 'International',
    tags,
    calories: 420,
    protein: 20,
    carbs: 50,
    fat: 15,
    ingredients: [
      { name: 'Olive oil', amount: '2', unit: 'tbsp', notes: '' },
      { name: 'Onion, diced', amount: '1', unit: 'medium', notes: '' },
      { name: 'Garlic, minced', amount: '3', unit: 'cloves', notes: '' },
      { name: 'Mixed veggies', amount: '2', unit: 'cups', notes: 'fresh or frozen' },
      { name: 'Protein of choice', amount: '300', unit: 'g', notes: 'tofu/chicken/beans' },
      { name: 'Salt', amount: '1', unit: 'tsp', notes: 'to taste' },
      { name: 'Black pepper', amount: '1/2', unit: 'tsp', notes: '' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Heat olive oil in a pan over medium heat.' },
      { stepNumber: 2, description: 'Sauté onion until translucent, then add garlic and cook 30 seconds.' },
      { stepNumber: 3, description: 'Add protein and cook until done; season with salt and pepper.' },
      { stepNumber: 4, description: 'Stir in mixed veggies and cook until tender-crisp.' },
      { stepNumber: 5, description: 'Adjust seasoning and serve warm.' },
    ],
  }
}

function titleCase(s: string) {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())
}

function normalizeDifficulty(d: string) {
  const v = String(d || '').toUpperCase()
  return v === 'MEDIUM' || v === 'HARD' ? v : 'EASY'
}

function normalizeCategory(c: string) {
  const v = String(c || '').toUpperCase()
  const allowed = [
    'BREAKFAST','LUNCH','DINNER','DESSERT','SNACK','BEVERAGE','APPETIZER','SOUP','SALAD','MAIN_COURSE','SIDE_DISH'
  ]
  return allowed.includes(v) ? v : 'DINNER'
}

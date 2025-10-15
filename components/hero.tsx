'use client'

import { useState } from 'react'
import { SparklesIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { RecipeGenerator } from './recipe-generator'

interface HeroProps {
  onGenerated?: () => void
}

export function Hero({ onGenerated }: HeroProps) {
  const [showGenerator, setShowGenerator] = useState(false)

  return (
    <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Smart Recipe Generator
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create amazing recipes with AI assistance. Get personalized recommendations 
          based on your ingredients and dietary preferences.
        </p>
        
        {!showGenerator ? (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setShowGenerator(true)}
              className="inline-flex items-center gap-3 bg-white text-primary-500 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <SparklesIcon className="w-6 h-6" />
              Start Creating Recipes
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Recipe Generator</h2>
                <button
                  onClick={() => setShowGenerator(false)}
                  className="text-white/80 hover:text-white"
                >
                  <ArrowDownIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-white/80">Generate recipes using artificial intelligence</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized</h3>
            <p className="text-white/80">Customized based on your preferences</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
            <p className="text-white/80">Get recipes in seconds, not hours</p>
          </div>
        </div>
      </div>

      {showGenerator && (
        <div className="container mx-auto px-4 mt-8">
          <RecipeGenerator onGenerated={onGenerated} />
        </div>
      )}
    </section>
  )
}

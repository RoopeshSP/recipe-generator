'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-500">🍳</span>
            <span className="text-xl font-bold text-gray-900">Smart Recipes</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/recipes" className="text-gray-700 hover:text-primary-600 transition-colors">
              Browse Recipes
            </Link>
            <Link href="/create" className="text-gray-700 hover:text-primary-600 transition-colors">
              Create Recipe
            </Link>
            <Link href="/my-recipes" className="text-gray-700 hover:text-primary-600 transition-colors">
              My Recipes
            </Link>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                href="/create"
                className="btn-primary flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Create Recipe
              </Link>
              
              <Link
                href="/login"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t">
            <div className="py-4 space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/recipes"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Browse Recipes
              </Link>
              <Link
                href="/create"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Create Recipe
              </Link>
              <Link
                href="/my-recipes"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                My Recipes
              </Link>
              <Link
                href="/login"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

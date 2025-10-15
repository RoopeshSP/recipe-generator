'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  onSearch?: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search recipes, ingredients, or cuisines..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pl-10 pr-4 py-3 w-full"
        />
      </div>
    </form>
  )
}

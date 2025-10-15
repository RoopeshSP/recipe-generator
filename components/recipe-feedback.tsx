'use client'

import { useState, useEffect } from 'react'
import { 
  HeartIcon, 
  StarIcon, 
  ShareIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartSolidIcon, 
  BookmarkIcon as BookmarkSolidIcon 
} from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface RecipeFeedbackProps {
  recipeId: string
  initialRating?: number
  initialIsFavorite?: boolean
  initialIsSaved?: boolean
  onRatingChange?: (rating: number) => void
  onFavoriteToggle?: (isFavorite: boolean) => void
  onSaveToggle?: (isSaved: boolean) => void
  className?: string
}

export function RecipeFeedback({
  recipeId,
  initialRating = 0,
  initialIsFavorite = false,
  initialIsSaved = false,
  onRatingChange,
  onFavoriteToggle,
  onSaveToggle,
  className = ''
}: RecipeFeedbackProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Load user's previous interactions from localStorage or API
    const savedData = localStorage.getItem(`recipe-${recipeId}`)
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setRating(data.rating || 0)
        setIsFavorite(data.isFavorite || false)
        setIsSaved(data.isSaved || false)
      } catch (error) {
        console.error('Error loading saved recipe data:', error)
      }
    }
  }, [recipeId])

  const handleRatingChange = async (newRating: number) => {
    setRating(newRating)
    onRatingChange?.(newRating)
    
    try {
      // Save to localStorage
      const savedData = {
        rating: newRating,
        isFavorite,
        isSaved
      }
      localStorage.setItem(`recipe-${recipeId}`, JSON.stringify(savedData))
      
      // In a real app, you would also save to your backend
      // await saveRating(recipeId, newRating)
      
      toast.success('Rating saved!')
    } catch (error) {
      console.error('Error saving rating:', error)
      toast.error('Failed to save rating')
    }
  }

  const handleFavoriteToggle = async () => {
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    onFavoriteToggle?.(newFavoriteState)
    
    try {
      // Save to localStorage
      const savedData = {
        rating,
        isFavorite: newFavoriteState,
        isSaved
      }
      localStorage.setItem(`recipe-${recipeId}`, JSON.stringify(savedData))
      
      // In a real app, you would also save to your backend
      // await toggleFavorite(recipeId, newFavoriteState)
      
      toast.success(newFavoriteState ? 'Added to favorites!' : 'Removed from favorites')
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Failed to update favorites')
    }
  }

  const handleSaveToggle = async () => {
    const newSavedState = !isSaved
    setIsSaved(newSavedState)
    onSaveToggle?.(newSavedState)
    
    try {
      // Save to localStorage
      const savedData = {
        rating,
        isFavorite,
        isSaved: newSavedState
      }
      localStorage.setItem(`recipe-${recipeId}`, JSON.stringify(savedData))
      
      // In a real app, you would also save to your backend
      // await toggleSave(recipeId, newSavedState)
      
      toast.success(newSavedState ? 'Recipe saved!' : 'Recipe removed from saved')
    } catch (error) {
      console.error('Error toggling save:', error)
      toast.error('Failed to update saved recipes')
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: 'Check out this recipe!',
      text: 'I found this amazing recipe and thought you might like it.',
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error)
          fallbackShare()
        }
      }
    } else {
      fallbackShare()
    }
  }

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Recipe link copied to clipboard!')
  }

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) {
      toast.error('Please write a review')
      return
    }

    setIsSubmitting(true)
    try {
      // In a real app, you would save the review to your backend
      // await submitReview(recipeId, reviewText, rating)
      
      toast.success('Review submitted successfully!')
      setReviewText('')
      setShowReviewForm(false)
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayRating = hoveredRating || rating

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Rating Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingChange(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-colors"
            >
              <StarIcon
                className={`w-6 h-6 ${
                  star <= displayRating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {rating} star{rating > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleFavoriteToggle}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            isFavorite
              ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
              : 'border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-700'
          }`}
        >
          {isFavorite ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5" />
          )}
          {isFavorite ? 'Favorited' : 'Add to Favorites'}
        </button>

        <button
          onClick={handleSaveToggle}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            isSaved
              ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
              : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
          }`}
        >
          {isSaved ? (
            <BookmarkSolidIcon className="w-5 h-5 text-blue-500" />
          ) : (
            <BookmarkIcon className="w-5 h-5" />
          )}
          {isSaved ? 'Saved' : 'Save Recipe'}
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <ShareIcon className="w-5 h-5" />
          Share
        </button>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <ChatBubbleLeftIcon className="w-5 h-5" />
          {showReviewForm ? 'Cancel Review' : 'Write Review'}
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Write a Review</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <StarIcon
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleReviewSubmit}
                disabled={isSubmitting || !reviewText.trim()}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="flex items-center gap-6 text-sm text-gray-500 pt-2 border-t border-gray-200">
        <span>⭐ 4.5 average rating</span>
        <span>💖 127 favorites</span>
        <span>💬 23 reviews</span>
      </div>
    </div>
  )
}

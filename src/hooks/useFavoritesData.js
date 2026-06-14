// src/hooks/useFavoritesData.js
import { useState, useEffect } from 'react'
import { getCocktailById } from '../api/cocktail'
import { useAuth } from '../context/useAuth'

/**
 * Favorites 페이지에서 사용하는 데이터 패칭 로직
 */
export function useFavoritesData() {
  const { isAuthenticated, favorites } = useAuth()
  const [cocktails, setCocktails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && favorites.length > 0) {
      loadFavoriteCocktails()
    } else {
      setCocktails([])
      setLoading(false)
    }
  }, [isAuthenticated, favorites])

  const loadFavoriteCocktails = async () => {
    setLoading(true)
    try {
      const results = await Promise.all(favorites.map((id) => getCocktailById(id)))
      setCocktails(results.filter(Boolean))
    } catch (error) {
      console.error('Failed to load favorite cocktails:', error)
      setCocktails([])
    }
    setLoading(false)
  }

  return { cocktails, loading }
}

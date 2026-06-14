// src/hooks/useHomeData.js
import { useState, useEffect } from 'react'
import { getRandomCocktail, searchCocktailsByFirstLetter } from '../api/cocktail'

/**
 * Home 페이지에서 사용하는 데이터 패칭 로직
 * - todayCocktail은 자동 로드하지 않음. fetchTodayCocktail()을 직접 호출해야 함.
 */
export function useHomeData() {
  const [todayCocktail, setTodayCocktail] = useState(null)
  const [popularCocktails, setPopularCocktails] = useState([])
  const [loading, setLoading] = useState(true)
  const [todayLoading, setTodayLoading] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      const popular = await searchCocktailsByFirstLetter('m')
      setPopularCocktails(popular.slice(0, 8))
    } catch (error) {
      console.error('Failed to load home data:', error)
    }
    setLoading(false)
  }

  const fetchTodayCocktail = async () => {
    setTodayLoading(true)
    try {
      const random = await getRandomCocktail()
      setTodayCocktail(random)
    } catch (error) {
      console.error('Failed to fetch today cocktail:', error)
    }
    setTodayLoading(false)
  }

  return { todayCocktail, popularCocktails, loading, todayLoading, fetchTodayCocktail }
}

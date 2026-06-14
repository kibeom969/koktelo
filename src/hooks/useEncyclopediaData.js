// src/hooks/useEncyclopediaData.js
import { useState, useEffect } from 'react'
import {
  searchCocktailsByFirstLetter,
  getCategoriesList,
  getGlassesList,
  getAlcoholicFiltersList,
  getCocktailById,
} from '../api/cocktail'

/**
 * Encyclopedia 페이지에서 사용하는 데이터 패칭 및 필터 로직
 */
export function useEncyclopediaData() {
  const [allCocktails, setAllCocktails] = useState([])
  const [filteredCocktails, setFilteredCocktails] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLetter, setSelectedLetter] = useState('all')

  const [categories, setCategories] = useState([])
  const [glasses, setGlasses] = useState([])
  const [alcoholicTypes, setAlcoholicTypes] = useState([])

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedGlass, setSelectedGlass] = useState('')
  const [selectedAlcoholic, setSelectedAlcoholic] = useState('')

  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    loadFilterOptions()
    loadAllCocktails()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [allCocktails, selectedLetter, selectedCategory, selectedGlass, selectedAlcoholic, searchTerm])

  const loadFilterOptions = async () => {
    try {
      const [cats, gls, alcs] = await Promise.all([
        getCategoriesList(),
        getGlassesList(),
        getAlcoholicFiltersList(),
      ])
      setCategories(cats.map((c) => c.strCategory))
      setGlasses(gls.map((g) => g.strGlass))
      setAlcoholicTypes(alcs.map((a) => a.strAlcoholic))
    } catch (error) {
      console.error('Failed to load filter options:', error)
    }
  }

  const loadAllCocktails = async () => {
    setLoading(true)
    try {
      const letterPromises = 'abcdefghijklmnopqrstvwyz'
        .split('')
        .map((letter) => searchCocktailsByFirstLetter(letter))
      const results = await Promise.all(letterPromises)
      const allDrinks = results.flat().filter(Boolean)
      const uniqueDrinks = Array.from(
        new Map(allDrinks.map((d) => [d.idDrink, d])).values()
      ).filter((d) => d.strCategory !== 'Cocoa')
      setAllCocktails(uniqueDrinks)
    } catch (error) {
      console.error('Failed to load cocktails:', error)
      setAllCocktails([])
    }
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...allCocktails]
    if (searchTerm.trim()) {
      filtered = filtered.filter((c) =>
        c.strDrink.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedLetter !== 'all') {
      filtered = filtered.filter((c) =>
        c.strDrink.toLowerCase().startsWith(selectedLetter)
      )
    }
    if (selectedCategory) {
      filtered = filtered.filter((c) => c.strCategory === selectedCategory)
    }
    if (selectedGlass) {
      filtered = filtered.filter((c) => c.strGlass === selectedGlass)
    }
    if (selectedAlcoholic) {
      filtered = filtered.filter((c) => c.strAlcoholic === selectedAlcoholic)
    }
    setFilteredCocktails(filtered)
  }

  const fetchCocktailDetail = async (cocktail, onSuccess) => {
    if (!cocktail.strInstructions) {
      setDetailLoading(true)
      try {
        const full = await getCocktailById(cocktail.idDrink)
        onSuccess(full || cocktail)
      } catch (error) {
        console.error('Failed to load cocktail details:', error)
        onSuccess(cocktail)
      }
      setDetailLoading(false)
    } else {
      onSuccess(cocktail)
    }
  }

  const hasActiveFilter = selectedCategory || selectedGlass || selectedAlcoholic
  const activeFilterCount = [selectedCategory, selectedGlass, selectedAlcoholic].filter(Boolean).length

  return {
    filteredCocktails,
    loading,
    detailLoading,
    searchTerm,
    setSearchTerm,
    selectedLetter,
    setSelectedLetter,
    categories,
    glasses,
    alcoholicTypes,
    selectedCategory,
    setSelectedCategory,
    selectedGlass,
    setSelectedGlass,
    selectedAlcoholic,
    setSelectedAlcoholic,
    hasActiveFilter,
    activeFilterCount,
    fetchCocktailDetail,
  }
}

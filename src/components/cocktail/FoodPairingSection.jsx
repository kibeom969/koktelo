// src/components/cocktail/FoodPairingSection.jsx
import { useState } from 'react'
import { Utensils, ChefHat, Loader2 } from 'lucide-react'
import { recommendFoodPairings } from '../../api/gemini'
import { searchMealsByName, extractMealIngredients, getMealIngredientImage } from '../../api/meal'
import Button from '../common/Button'
import './CocktailDetail.css'
import './FoodPairingSection.css'

/**
 * AI 안주 추천 섹션
 * Props:
 * cocktailName:  string
 * category:      string
 * ingredients:   Array<{ ingredient: string }>
 */
function FoodPairingSection({ cocktailName, category, ingredients }) {
  const [foodPairings, setFoodPairings] = useState(null)
  const [pairingMeals, setPairingMeals] = useState([])
  const [pairingLoading, setPairingLoading] = useState(false)
  const [expandedIndex, setExpandedIndex] = useState(null)

  const loadFoodPairings = async () => {
    setPairingLoading(true)
    setFoodPairings(null)
    setPairingMeals([])
    setExpandedIndex(null)

    try {
      const ingredientNames = ingredients.map((i) => i.ingredient)
      const pairings = await recommendFoodPairings(cocktailName, category || '', ingredientNames)
      setFoodPairings(pairings)

      const mealResults = await Promise.all(
        pairings.map(async (pairing) => {
          const searchTerms = [pairing.foodName, ...(pairing.searchTerms || [])]
          for (const term of searchTerms) {
            const meals = await searchMealsByName(term)
            if (meals.length > 0) return meals[0]
          }
          return null
        })
      )
      setPairingMeals(mealResults)
    } catch (error) {
      console.error('Failed to load food pairings:', error)
    }

    setPairingLoading(false)
  }

  // 선택된 레시피 데이터 추출
  const expandedMeal = expandedIndex !== null ? pairingMeals[expandedIndex] : null
  const expandedMealIngredients = expandedMeal ? extractMealIngredients(expandedMeal) : []

  return (
    <section className="cocktail-detail-section">
      <h3 className="cocktail-detail-section-title">
        <Utensils size={18} style={{ marginRight: '8px' }} />
        추천 안주
      </h3>

      {!foodPairings && !pairingLoading && (
        <Button onClick={loadFoodPairings} icon={<ChefHat size={18} />}>
          AI 안주 추천받기
        </Button>
      )}

      {pairingLoading && (
        <div className="pairing-loading">
          <Loader2 size={24} className="animate-spin" />
          <span>AI가 어울리는 안주를 찾고 있습니다...</span>
        </div>
      )}

      {foodPairings && !pairingLoading && (
        <div className="food-pairing-result">
          {/* 1. 상단: 안주 카드 그리드 영역 */}
          <div className="food-pairing-grid">
            {foodPairings.map((pairing, idx) => {
              const meal = pairingMeals[idx]
              const isExpanded = expandedIndex === idx

              return (
                <div key={idx} className="food-pairing-col">
                  <div className="food-pairing-card food-pairing-card--vertical">
                    {meal ? (
                      <img
                        src={meal.strMealThumb}
                        alt={meal.strMeal}
                        className="food-pairing-image food-pairing-image--top"
                      />
                    ) : (
                      <div className="food-pairing-image-placeholder">
                        <Utensils size={32} />
                      </div>
                    )}
                    <div className="food-pairing-content">
                      <h4 className="food-pairing-name">
                        {pairing.foodNameKorean}
                        <span className="food-pairing-name-en">({pairing.foodName})</span>
                      </h4>
                      <p className="food-pairing-reason">{pairing.reason}</p>
                      {meal && (
                        <button
                          className="recipe-toggle-btn"
                          onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                        >
                          {isExpanded ? '레시피 접기' : '레시피 보기'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Button
            variant="ghost"
            size="small"
            onClick={loadFoodPairings}
            style={{ marginTop: '16px' }}
          >
            다른 안주 추천받기
          </Button>

          {/* 2. 하단: 선택된 레시피 영역 (그리드 밖으로 분리) */}
          {expandedMeal && (
            <div className="meal-recipe animate-slide-down">
              <div className="meal-recipe-section">
                <h5 className="meal-recipe-title">재료</h5>
                <ul className="meal-ingredients-list">
                  {expandedMealIngredients.map((item, i) => (
                    <li key={i} className="meal-ingredient">
                      <img
                        src={getMealIngredientImage(item.ingredient)}
                        alt={item.ingredient}
                        className="meal-ingredient-image"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                      <span className="meal-ingredient-name">{item.ingredient}</span>
                      {item.measure && (
                        <span className="meal-ingredient-measure">{item.measure}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="meal-recipe-section">
                <h5 className="meal-recipe-title">만드는 방법</h5>
                <p className="meal-instructions">{expandedMeal.strInstructions}</p>
              </div>
              {expandedMeal.strYoutube && (
                <div className="meal-recipe-section">
                  <h5 className="meal-recipe-title">영상 보기</h5>
                  <a
                    href={expandedMeal.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meal-youtube-link"
                  >
                    YouTube에서 보기
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default FoodPairingSection

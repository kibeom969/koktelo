// src/components/recommend/IngredientsTab.jsx
import { useState, useEffect } from 'react'
import { Package, Check } from 'lucide-react'
import { getIngredientsList, filterByIngredient, getCocktailById, getIngredientImage } from '../../api/cocktail'
import { useAuth } from '../../context/useAuth'
import { classNames } from '../../utils/helpers'
import CocktailCard from '../cocktail/CocktailCard'
import CocktailDetailPreview from '../cocktail/CocktailDetailPreview'
import CocktailDetailSkeleton from '../cocktail/CocktailDetailSkeleton'
import Button from '../common/Button'
import '../../pages/Recommend.css'

/**
 * 재료별 칵테일 탭 패널
 * Props:
 *   onCocktailClick: (cocktail) => void
 */
function IngredientsTab({ onCocktailClick }) {
  const { isAuthenticated, myIngredients, updateMyIngredients } = useAuth()

  const [ingredientsList, setIngredientsList] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [ingredientCocktails, setIngredientCocktails] = useState([])
  const [loading, setLoading] = useState(false)
  const [ingredientSearch, setIngredientSearch] = useState('')
  const [previewCocktail, setPreviewCocktail] = useState(null)

  useEffect(() => {
    loadIngredientsList()
  }, [])

  useEffect(() => {
    if (isAuthenticated && myIngredients.length > 0) {
      setSelectedIngredients(myIngredients)
    }
  }, [isAuthenticated, myIngredients])

  const loadIngredientsList = async () => {
    try {
      const data = await getIngredientsList()
      setIngredientsList(data.map((i) => i.strIngredient1))
    } catch (error) {
      console.error('Failed to load ingredients:', error)
    }
  }

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) => {
      const next = prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
      if (isAuthenticated) updateMyIngredients(next)
      return next
    })
  }

  const clearSelection = () => {
    setSelectedIngredients([])
    if (isAuthenticated) updateMyIngredients([])
  }

  const searchByIngredients = async () => {
    if (selectedIngredients.length === 0) return
    setLoading(true)
    setPreviewCocktail(null)
    try {
      const results = await Promise.all(
        selectedIngredients.map((ing) => filterByIngredient(ing))
      )
      const counts = {}
      results.flat().forEach((c) => {
        counts[c.idDrink] = (counts[c.idDrink] || 0) + 1
      })
      const sorted = results
        .flat()
        .filter((c, i, arr) => arr.findIndex((x) => x.idDrink === c.idDrink) === i)
        .sort((a, b) => counts[b.idDrink] - counts[a.idDrink])
        .slice(0, 12)

      const detailed = await Promise.all(sorted.map((c) => getCocktailById(c.idDrink)))
      const filtered = detailed.filter(Boolean)
      setIngredientCocktails(filtered)
      if (filtered.length > 0) setPreviewCocktail(filtered[0])
    } catch (error) {
      console.error('Failed to search by ingredients:', error)
    }
    setLoading(false)
  }

  const filteredIngredients = ingredientsList.filter((ing) =>
    ing.toLowerCase().includes(ingredientSearch.toLowerCase())
  )

  const showPreview = previewCocktail && !loading

  return (
    <div className="tab-panel animate-fade-in" role="tabpanel">
      <div className="ing-layout--split">
        {/* 왼쪽: 항상 표시되는 스켈레톤 / 상세 패널 */}
        <aside className="ai-preview-pane">
          <p className="ai-preview-label">
            {loading ? '검색 중...' : showPreview ? '레시피 미리보기' : '추천 결과 미리보기'}
          </p>
          {showPreview
            ? <CocktailDetailPreview cocktail={previewCocktail} />
            : <CocktailDetailSkeleton />
          }
        </aside>

        {/* 오른쪽: 재료 선택 + 결과 */}
        <div className="ingredients-panel">
          <div className="ingredients-description">
            <h2>어떤 재료를 가지고 계신가요?</h2>
            <p>보유한 재료를 선택하면 만들 수 있는 칵테일을 찾아드립니다.</p>
            {!isAuthenticated && (
              <p className="ingredients-hint">로그인하면 재료 선택을 저장할 수 있습니다.</p>
            )}
          </div>

          <div className="ingredients-selector">
            <div className="ingredients-search">
              <input
                type="text"
                placeholder="재료 검색..."
                value={ingredientSearch}
                onChange={(e) => setIngredientSearch(e.target.value)}
                className="ingredients-search-input"
                aria-label="재료 검색"
              />
            </div>

            <ul className="ingredients-list" role="list">
              {filteredIngredients.slice(0, 50).map((ingredient) => (
                <li key={ingredient}>
                  <button
                    className={classNames(
                      'ingredient-chip',
                      selectedIngredients.includes(ingredient) && 'ingredient-chip--selected'
                    )}
                    onClick={() => toggleIngredient(ingredient)}
                    aria-pressed={selectedIngredients.includes(ingredient)}
                  >
                    <img
                      src={getIngredientImage(ingredient)}
                      alt={ingredient}
                      className="ingredient-chip-img"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    {selectedIngredients.includes(ingredient) && (
                      <Check size={13} aria-hidden="true" className="ingredient-chip-check" />
                    )}
                    <span>{ingredient}</span>
                  </button>
                </li>
              ))}
            </ul>

            {selectedIngredients.length > 0 && (
              <div className="selected-summary">
                <span>{selectedIngredients.length}개 재료 선택됨</span>
                <button className="clear-selection" onClick={clearSelection}>
                  전체 해제
                </button>
              </div>
            )}

            <Button
              size="large"
              onClick={searchByIngredients}
              disabled={selectedIngredients.length === 0}
              loading={loading}
              icon={<Package size={18} />}
            >
              칵테일 찾기
            </Button>
          </div>

          {ingredientCocktails.length > 0 && (
            <div className="ingredients-results animate-slide-up">
              <h3>만들 수 있는 칵테일 ({ingredientCocktails.length}개)</h3>
              <div className="cocktails-grid">
                {ingredientCocktails.map((cocktail) => (
                  <div
                    key={cocktail.idDrink}
                    onMouseEnter={() => setPreviewCocktail(cocktail)}
                  >
                    <CocktailCard
                      cocktail={cocktail}
                      onClick={onCocktailClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IngredientsTab

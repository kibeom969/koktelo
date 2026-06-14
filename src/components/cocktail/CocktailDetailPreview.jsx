// src/components/cocktail/CocktailDetailPreview.jsx
// 추천 페이지 미리보기 패널 전용 칵테일 상세 컴포넌트
// FoodPairingSection 없이 이미지·메타·재료·조리법만 표시하며
// ai-preview-pane (600px) 너비에 최적화된 레이아웃을 사용합니다.
import { Heart, Wine } from 'lucide-react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { extractIngredients, getIngredientImage } from '../../api/cocktail'
import { translateToKorean } from '../../api/gemini'
import { classNames } from '../../utils/helpers'
import { CATEGORY_KO, GLASS_KO, ALCOHOLIC_KO } from '../../constants/cocktailMappings'
import './CocktailDetailPreview.css'

function CocktailDetailPreview({ cocktail }) {
  const { isAuthenticated, isFavorited, toggleFavorite } = useAuth()
  const [translated, setTranslated] = useState(null)
  const [translating, setTranslating] = useState(false)

  if (!cocktail) return null

  const ingredients = extractIngredients(cocktail)
  const isFav = isAuthenticated && isFavorited(cocktail.idDrink)

  const handleFavoriteClick = () => {
    if (isAuthenticated) toggleFavorite(cocktail.idDrink)
  }

  const handleTranslate = async () => {
    if (translated || translating || !cocktail.strInstructions) return
    setTranslating(true)
    const result = await translateToKorean(cocktail.strInstructions)
    setTranslated(result)
    setTranslating(false)
  }

  const displayText = translated || cocktail.strInstructionsKO || cocktail.strInstructions
  const showTranslateButton = !translated && !cocktail.strInstructionsKO && !translating

  return (
    <div className="cdp">
      {/* 헤더: 이미지 + 메타 정보 */}
      <div className="cdp-header">
        <img
          src={cocktail.strDrinkThumb}
          alt={cocktail.strDrink}
          className="cdp-image"
        />
        <div className="cdp-info">
          <div className="cdp-title-row">
            <h2 className="cdp-title">{cocktail.strDrink}</h2>
            {isAuthenticated && (
              <button
                className={classNames('cdp-favorite', isFav && 'cdp-favorite--active')}
                onClick={handleFavoriteClick}
                aria-label={isFav ? '찜 해제' : '찜하기'}
              >
                <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
          <div className="cdp-meta">
            {cocktail.strCategory && (
              <span className="cdp-tag">
                <Wine size={12} />
                {CATEGORY_KO[cocktail.strCategory] || cocktail.strCategory}
              </span>
            )}
            {cocktail.strGlass && (
              <span className="cdp-tag">
                {GLASS_KO[cocktail.strGlass] || cocktail.strGlass}
              </span>
            )}
            {cocktail.strAlcoholic && (
              <span
                className={classNames(
                  'cdp-tag',
                  cocktail.strAlcoholic === 'Alcoholic'
                    ? 'cdp-tag--alcoholic'
                    : 'cdp-tag--non-alcoholic'
                )}
              >
                {ALCOHOLIC_KO[cocktail.strAlcoholic] || cocktail.strAlcoholic}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 재료 */}
      {ingredients && ingredients.length > 0 && (
        <section className="cdp-section">
          <h3 className="cdp-section-title">재료</h3>
          <ul className="cdp-ingredients">
            {ingredients.map((item, index) => (
              <li key={index} className="cdp-ingredient">
                <img
                  src={getIngredientImage(item.ingredient)}
                  alt={item.ingredient}
                  className="cdp-ingredient-image"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <div className="cdp-ingredient-info">
                  <span className="cdp-ingredient-name">{item.ingredient}</span>
                  {item.measure && (
                    <span className="cdp-ingredient-measure">{item.measure}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 만드는 방법 */}
      {cocktail.strInstructions && (
        <section className="cdp-section">
          <h3 className="cdp-section-title">만드는 방법</h3>
          {translating ? (
            <div className="cdp-translating">
              <Loader2 size={15} className="animate-spin" />
              <span>번역 중...</span>
            </div>
          ) : (
            <p className="cdp-instructions">{displayText}</p>
          )}
        </section>
      )}
    </div>
  )
}

export default CocktailDetailPreview

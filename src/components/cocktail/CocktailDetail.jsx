// src/components/cocktail/CocktailDetail.jsx
import { Heart, Wine } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { extractIngredients } from '../../api/cocktail'
import { classNames } from '../../utils/helpers'
import { CATEGORY_KO, GLASS_KO, ALCOHOLIC_KO } from '../../constants/cocktailMappings'
import CocktailIngredients from './CocktailIngredients'
import CocktailInstructions from './CocktailInstructions'
import FoodPairingSection from './FoodPairingSection'
import './CocktailDetail.css'

function CocktailDetail({ cocktail }) {
  const { isAuthenticated, isFavorited, toggleFavorite } = useAuth()

  if (!cocktail) return null

  const ingredients = extractIngredients(cocktail)
  const isFav = isAuthenticated && isFavorited(cocktail.idDrink)

  const handleFavoriteClick = () => {
    if (isAuthenticated) toggleFavorite(cocktail.idDrink)
  }

  return (
    <div className="cocktail-detail">
      {/* 헤더: 이미지 + 메타 정보 */}
      <div className="cocktail-detail-header">
        <img
          src={cocktail.strDrinkThumb}
          alt={cocktail.strDrink}
          className="cocktail-detail-image"
        />
        <div className="cocktail-detail-info">
          <div className="cocktail-detail-title-row">
            <h2 className="cocktail-detail-title">{cocktail.strDrink}</h2>
            {isAuthenticated && (
              <button
                className={classNames(
                  'cocktail-detail-favorite',
                  isFav && 'cocktail-detail-favorite--active'
                )}
                onClick={handleFavoriteClick}
                aria-label={isFav ? '찜 해제' : '찜하기'}
              >
                <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>

          <div className="cocktail-detail-meta">
            {cocktail.strCategory && (
              <span className="cocktail-detail-tag">
                <Wine size={14} />
                {CATEGORY_KO[cocktail.strCategory] || cocktail.strCategory}
              </span>
            )}
            {cocktail.strGlass && (
              <span className="cocktail-detail-tag">
                {GLASS_KO[cocktail.strGlass] || cocktail.strGlass}
              </span>
            )}
            {cocktail.strAlcoholic && (
              <span
                className={classNames(
                  'cocktail-detail-tag',
                  cocktail.strAlcoholic === 'Alcoholic'
                    ? 'cocktail-detail-tag--alcoholic'
                    : 'cocktail-detail-tag--non-alcoholic'
                )}
              >
                {ALCOHOLIC_KO[cocktail.strAlcoholic] || cocktail.strAlcoholic}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 재료 */}
      <CocktailIngredients ingredients={ingredients} />

      {/* 만드는 방법 */}
      <CocktailInstructions
        instructions={cocktail.strInstructions}
        instructionsKO={cocktail.strInstructionsKO}
      />

      {/* AI 안주 추천 */}
      <FoodPairingSection
        cocktailName={cocktail.strDrink}
        category={cocktail.strCategory}
        ingredients={ingredients}
      />
    </div>
  )
}

export default CocktailDetail

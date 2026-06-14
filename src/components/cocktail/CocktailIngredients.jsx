// src/components/cocktail/CocktailIngredients.jsx
import { getIngredientImage } from '../../api/cocktail'
import './CocktailDetail.css'

/**
 * 칵테일 재료 목록 섹션
 * Props:
 *   ingredients: Array<{ ingredient: string, measure: string }>
 */
function CocktailIngredients({ ingredients }) {
  if (!ingredients || ingredients.length === 0) return null

  return (
    <section className="cocktail-detail-section">
      <h3 className="cocktail-detail-section-title">재료</h3>
      <ul className="cocktail-detail-ingredients">
        {ingredients.map((item, index) => (
          <li key={index} className="cocktail-detail-ingredient">
            <img
              src={getIngredientImage(item.ingredient)}
              alt={item.ingredient}
              className="cocktail-detail-ingredient-image"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div className="cocktail-detail-ingredient-info">
              <span className="cocktail-detail-ingredient-name">{item.ingredient}</span>
              {item.measure && (
                <span className="cocktail-detail-ingredient-measure">{item.measure}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CocktailIngredients

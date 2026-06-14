import { Heart } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { classNames } from '../../utils/helpers'
import './CocktailCard.css'

function CocktailCard({ cocktail, onClick, showFavorite = true }) {
  const { isAuthenticated, isFavorited, toggleFavorite } = useAuth()
  
  const isFav = isAuthenticated && isFavorited(cocktail.idDrink)

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    if (isAuthenticated) {
      toggleFavorite(cocktail.idDrink)
    }
  }

  return (
    <article 
      className="cocktail-card"
      onClick={() => onClick(cocktail)}
      tabIndex={0}
      role="button"
    >
      <div className="cocktail-card-image-wrapper">
        <img 
          src={cocktail.strDrinkThumb} 
          alt={cocktail.strDrink}
          className="cocktail-card-image"
          loading="lazy"
        />
        {showFavorite && isAuthenticated && (
          <button 
            className={classNames('cocktail-card-favorite', isFav && 'cocktail-card-favorite--active')}
            onClick={handleFavoriteClick}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
          </button>
        )}
        {cocktail.strCategory && (
          <span className="cocktail-card-category">{cocktail.strCategory}</span>
        )}
      </div>
      <div className="cocktail-card-content">
        <h3 className="cocktail-card-title">{cocktail.strDrink}</h3>
        {cocktail.strAlcoholic && (
          <span className={classNames(
            'cocktail-card-badge',
            cocktail.strAlcoholic === 'Alcoholic' ? 'cocktail-card-badge--alcoholic' : 'cocktail-card-badge--non-alcoholic'
          )}>
            {cocktail.strAlcoholic}
          </span>
        )}
      </div>
    </article>
  )
}

export default CocktailCard

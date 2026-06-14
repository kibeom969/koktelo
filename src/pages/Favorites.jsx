// src/pages/Favorites.jsx
import { Link } from 'react-router-dom'
import { Heart, LogIn } from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useFavoritesData } from '../hooks/useFavoritesData'
import { useCocktailModal } from '../hooks/useCocktailModal'
import CocktailGrid from '../components/cocktail/CocktailGrid'
import CocktailDetail from '../components/cocktail/CocktailDetail'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import './Favorites.css'

function Favorites() {
  const { isAuthenticated, favorites } = useAuth()
  const { cocktails, loading } = useFavoritesData()
  const { selectedCocktail, modalOpen, openModal, closeModal } = useCocktailModal()

  if (!isAuthenticated) {
    return (
      <div className="favorites">
        <div className="container">
          <div className="favorites-empty-state">
            <div className="empty-icon">
              <LogIn size={48} aria-hidden="true" />
            </div>
            <h2>로그인이 필요합니다</h2>
            <p>즐겨찾기 목록을 확인하려면 로그인이 필요합니다</p>
            <Link to="/login">
              <Button size="large">로그인</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites">
      <div className="container">
        <header className="favorites-header">
          <h1 className="favorites-title">
            즐겨찾기 목록
          </h1>
          <p className="favorites-subtitle">
            {cocktails.length > 0
              ? `${cocktails.length}개의 칵테일이 목록에 있습니다`
              : '아직 목록에 칵테일이 없습니다'}
          </p>
        </header>

        {favorites.length === 0 ? (
          <div className="favorites-empty-state">
            <div className="empty-icon">
              <Heart size={48} aria-hidden="true" />
            </div>
            <h2>즐겨찾기가 비어 있습니다</h2>
            <p>칵테일의 하트를 눌러 즐겨찾기에 추가하세요!</p>
            <Link to="/encyclopedia">
              <Button size="large">칵테일 둘러보기</Button>
            </Link>
          </div>
        ) : (
          <div className="favorites-results">
            <CocktailGrid
              cocktails={cocktails}
              loading={loading}
              onCocktailClick={openModal}
              emptyMessage="즐겨찾기한 칵테일을 불러오는 중 오류가 발생했습니다"
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title="칵테일 상세정보"
        size="large"
      >
        <CocktailDetail cocktail={selectedCocktail} />
      </Modal>
    </div>
  )
}

export default Favorites

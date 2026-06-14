// src/pages/Home.jsx
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, BookOpen, Shuffle } from 'lucide-react'
import { useHomeData } from '../hooks/useHomeData'
import { useCocktailModal } from '../hooks/useCocktailModal'
import CocktailCard from '../components/cocktail/CocktailCard'
import CocktailDetail from '../components/cocktail/CocktailDetail'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import './Home.css'

function Home() {
  const { todayCocktail, popularCocktails, loading, todayLoading, fetchTodayCocktail } =
    useHomeData()
  const { selectedCocktail, modalOpen, openModal, closeModal } = useCocktailModal()

  if (loading) {
    return (
      <div className="home">
        <section className="hero">
          <div className="hero-container container">
            <div className="hero-content">
              <div className="home-skel home-skel-h1" />
              <div className="home-skel home-skel-desc" />
              <div className="home-skel home-skel-desc home-skel-desc--sm" />
              <div className="hero-actions">
                <div className="home-skel home-skel-btn" />
                <div className="home-skel home-skel-btn" />
              </div>
            </div>
            <div className="hero-today">
              <div className="hero-today-skeleton" aria-hidden="true">
                <div className="hero-skel-image" />
                <div className="hero-skel-info">
                  <div className="hero-skel-badge" />
                  <div className="hero-skel-name" />
                  <div className="hero-skel-glass" />
                  <div className="hero-skel-btn" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section section--popular">
          <div className="container">
            <div className="section-header">
              <div>
                <div className="home-skel home-skel-section-title" />
                <div className="home-skel home-skel-section-sub" />
              </div>
            </div>
            <div className="popular-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="cocktail-card-skeleton" aria-hidden="true">
                  <div className="ccs-image" />
                  <div className="ccs-content">
                    <div className="ccs-title" />
                    <div className="ccs-badge" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container container">

          {/* 왼쪽: 텍스트 + 액션 */}
          <div className="hero-content">
            <h1 className="hero-title">
              나에게 딱 맞는{' '}<br />
              <span className="gradient-text">칵테일</span>을 발견하세요
            </h1>
            <p className="hero-description">
              오늘의 나에게 딱 맞는 칵테일을!
            </p>
            <div className="hero-actions">
              <Link to="/recommend">
                <Button size="large" icon={<Sparkles size={18} />}>
                  더 많은 추천
                </Button>
              </Link>
              <Link to="/encyclopedia">
                <Button size="large" variant="secondary" icon={<BookOpen size={18} />}>
                  칵테일 도감
                </Button>
              </Link>
            </div>
          </div>

          {/* 오른쪽: 오늘의 칵테일 카드 */}
          <div className="hero-today">
            <div className="hero-today-header">
              <div>
                <h2 className="hero-today-title">Today's Pick!</h2>
                <p className="hero-today-subtitle">버튼을 눌러 랜덤 칵테일을 확인하기</p>
              </div>
              <Button
                variant="secondary"
                size="small"
                icon={<Shuffle size={14} className={todayLoading ? 'animate-spin' : ''} />}
                onClick={fetchTodayCocktail}
                disabled={todayLoading}
              >
                추천받기
              </Button>
            </div>

            <div className="hero-today-card">
              {todayCocktail && !todayLoading ? (
                <>
                  <div className="hero-today-image-wrapper">
                    <img
                      src={todayCocktail.strDrinkThumb}
                      alt={todayCocktail.strDrink}
                      className="hero-today-image"
                    />
                  </div>
                  <div className="hero-today-info">
                    <span className="hero-today-category">{todayCocktail.strCategory}</span>
                    <h3 className="hero-today-name">{todayCocktail.strDrink}</h3>
                    <p className="hero-today-glass">{todayCocktail.strGlass}</p>
                    <Button onClick={() => openModal(todayCocktail)}>
                      레시피 보기 <ArrowRight size={15} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="hero-today-skeleton" aria-hidden="true">
                  {/* 이미지 영역 */}
                  <div className="hero-skel-image" />
                  {/* 하단 정보 영역 */}
                  <div className="hero-skel-info">
                    <div className="hero-skel-badge" />
                    <div className="hero-skel-name" />
                    <div className="hero-skel-glass" />
                    <div className="hero-skel-btn" />
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Popular Cocktails Section */}
      <section className="section section--popular">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">인기 칵테일</h2>
              <p className="section-subtitle">모두가 사랑하는 클래식</p>
            </div>
            <Link to="/encyclopedia">
              <Button variant="ghost">
                전체보기
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="popular-grid">
            {popularCocktails.map((cocktail) => (
              <CocktailCard
                key={cocktail.idDrink}
                cocktail={cocktail}
                onClick={openModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
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

export default Home

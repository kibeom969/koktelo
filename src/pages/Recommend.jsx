// src/pages/Recommend.jsx
import { useState } from 'react'
import { useCocktailModal } from '../hooks/useCocktailModal'
import RecommendTabs from '../components/recommend/RecommendTabs'
import AiTab from '../components/recommend/AiTab'
import IngredientsTab from '../components/recommend/IngredientsTab'
import CocktailDetail from '../components/cocktail/CocktailDetail'
import Modal from '../components/common/Modal'
import './Recommend.css'

function Recommend() {
  const [activeTab, setActiveTab] = useState('ai')
  const { selectedCocktail, modalOpen, openModal, closeModal } = useCocktailModal()

  return (
    <div className="recommend">
      <div className="container">
        <header className="recommend-header">
          <h1 className="recommend-title">칵테일 추천받기</h1>
          <p className="recommend-subtitle">
            두 가지 방법으로 완벽한 칵테일을 찾아보세요
          </p>
        </header>

        <RecommendTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="recommend-content">
          {activeTab === 'ai' && <AiTab onCocktailClick={openModal} />}
          {activeTab === 'ingredients' && <IngredientsTab onCocktailClick={openModal} />}
        </div>
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

export default Recommend

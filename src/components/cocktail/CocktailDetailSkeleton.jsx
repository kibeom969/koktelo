// src/components/cocktail/CocktailDetailSkeleton.jsx
import './CocktailDetailSkeleton.css'

/**
 * CocktailDetail 로딩 중 표시할 스켈레톤 UI
 * AiTab / IngredientsTab 의 왼쪽 패널에서 사용
 */
function CocktailDetailSkeleton() {
  return (
    <div className="skel-detail" aria-hidden="true">
      {/* 헤더: 이미지 + 메타 */}
      <div className="skel-detail-header">
        <div className="skel skel-image" />
        <div className="skel-detail-info">
          <div className="skel skel-title" />
          <div className="skel-tags">
            <div className="skel skel-tag" />
            <div className="skel skel-tag skel-tag--sm" />
            <div className="skel skel-tag skel-tag--sm" />
          </div>
        </div>
      </div>

      {/* 섹션 제목 */}
      <div className="skel skel-section-title" />

      {/* 재료 그리드 */}
      <div className="skel-ingredients">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skel-ingredient-item">
            <div className="skel skel-ing-img" />
            <div className="skel-ing-text">
              <div className="skel skel-ing-name" />
              <div className="skel skel-ing-measure" />
            </div>
          </div>
        ))}
      </div>

      {/* 섹션 제목 */}
      <div className="skel skel-section-title skel-section-title--mt" />

      {/* 본문 텍스트 줄 */}
      <div className="skel-lines">
        <div className="skel skel-line" />
        <div className="skel skel-line skel-line--80" />
        <div className="skel skel-line" />
        <div className="skel skel-line skel-line--60" />
      </div>
    </div>
  )
}

export default CocktailDetailSkeleton

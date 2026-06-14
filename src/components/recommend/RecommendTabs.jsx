// src/components/recommend/RecommendTabs.jsx
import { Image, Package } from 'lucide-react'
import { classNames } from '../../utils/helpers'
import '../../pages/Recommend.css'

const TAB_CONFIG = [
  { id: 'ai', label: 'AI 분석', Icon: Image },
  { id: 'ingredients', label: '재료별', Icon: Package },
]

/**
 * 추천 페이지 탭 네비게이션 바
 * Props:
 *   activeTab: string
 *   onTabChange: (tabId: string) => void
 */
function RecommendTabs({ activeTab, onTabChange }) {
  return (
    <nav className="recommend-tabs" role="tablist" aria-label="추천 방법 선택">
      {TAB_CONFIG.map(({ id, label, Icon }) => (
        <button
          key={id}
          role="tab"
          aria-selected={activeTab === id}
          className={classNames('recommend-tab', activeTab === id && 'recommend-tab--active')}
          onClick={() => onTabChange(id)}
        >
          <Icon size={18} aria-hidden="true" />
          {label}
        </button>
      ))}
    </nav>
  )
}

export default RecommendTabs

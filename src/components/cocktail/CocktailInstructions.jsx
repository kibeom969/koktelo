// src/components/cocktail/CocktailInstructions.jsx
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { translateToKorean } from '../../api/gemini'
import Button from '../common/Button'
import './CocktailDetail.css'

/**
 * 칵테일 만드는 방법 섹션 (한국어 번역 버튼 포함)
 * Props:
 *   instructions:    string  (영문 원본)
 *   instructionsKO:  string  (DB 제공 한국어, 있으면 번역 버튼 숨김)
 */
function CocktailInstructions({ instructions, instructionsKO }) {
  const [translated, setTranslated] = useState(null)
  const [translating, setTranslating] = useState(false)

  if (!instructions) return null

  const handleTranslate = async () => {
    if (translated || translating) return
    setTranslating(true)
    const result = await translateToKorean(instructions)
    setTranslated(result)
    setTranslating(false)
  }

  const displayText = translated || instructionsKO || instructions
  const showTranslateButton = !translated && !instructionsKO && !translating
  return (
    <section className="cocktail-detail-section">
      <h3 className="cocktail-detail-section-title">만드는 방법</h3>

      {translating ? (
        <div className="pairing-loading">
          <Loader2 size={18} className="animate-spin" />
          <span>번역 중...</span>
        </div>
      ) : (
        <p className="cocktail-detail-instructions">{displayText}</p>
      )}
      {showTranslateButton && (
        <Button style={{marginTop : '10px'}} onClick={handleTranslate}>
          번역
        </Button>
      )}
    </section>
  )
}

export default CocktailInstructions

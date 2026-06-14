import { useState } from 'react'
import { Upload, X, Image, AlertCircle } from 'lucide-react'
import { analyzeImageMood, isGeminiConfigured } from '../../api/gemini'
import { filterByIngredient, getCocktailById } from '../../api/cocktail'
import { fileToBase64 } from '../../utils/helpers'
import CocktailCard from '../cocktail/CocktailCard'
import CocktailDetailPreview from '../cocktail/CocktailDetailPreview'
import CocktailDetailSkeleton from '../cocktail/CocktailDetailSkeleton'
import Button from '../common/Button'
import '../../pages/Recommend.css'
import './AiTab.css'

/**
 * AI 이미지 분석 탭 패널
 */
function AiTab({ onCocktailClick }) {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [moodAnalysis, setMoodAnalysis] = useState(null)
  const [aiCocktails, setAiCocktails] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [previewCocktail, setPreviewCocktail] = useState(null)

  const readFile = (file) => {
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedImage(file)
    readFile(file)
    setMoodAnalysis(null)
    setAiCocktails([])
    setPreviewCocktail(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setUploadedImage(file)
      readFile(file)
      setMoodAnalysis(null)
      setAiCocktails([])
      setPreviewCocktail(null)
    }
  }

  const clearImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
    setMoodAnalysis(null)
    setAiCocktails([])
    setPreviewCocktail(null)
  }

  const analyzeImage = async () => {
    if (!uploadedImage) return
    setAiLoading(true)
    setPreviewCocktail(null)
    try {
      const base64 = await fileToBase64(uploadedImage)
      const analysis = await analyzeImageMood(base64)
      setMoodAnalysis(analysis)

      let cocktails = []
      for (const query of analysis.suggestedIngredients || []) {
        const results = await filterByIngredient(query)
        cocktails = [...cocktails, ...results]
      }

      const unique = Array.from(
        new Map(cocktails.map((c) => [c.idDrink, c])).values()
      ).slice(0, 8)

      const detailed = await Promise.all(unique.map((c) => getCocktailById(c.idDrink)))
      const filtered = detailed.filter(Boolean)
      setAiCocktails(filtered)
      if (filtered.length > 0) setPreviewCocktail(filtered)
    } catch (error) {
      console.error('Failed to analyze image:', error)
    }
    setAiLoading(false)
  }

  const handleCardHover = (cocktail) => {
    setPreviewCocktail(cocktail)
  }

  const showPreview = previewCocktail && !aiLoading

  return (
    <div className="tab-panel animate-fade-in" role="tabpanel">
     

      <div className="ai-layout--split">
        {/* 왼쪽: 레시피 미리보기 패널 */}
        <aside className="ai-preview-pane" >
          <p className="ai-preview-label">
            {aiLoading ? '분석 중...' : showPreview ? '레시피 미리보기' : '추천 결과 미리보기'}
          </p>
          {showPreview
            ? <CocktailDetailPreview cocktail={previewCocktail} />
            : <CocktailDetailSkeleton />
          }
        </aside>

        {/* 오른쪽: 업로드 및 분석 결과 패널 */}
        <div className="ai-panel">
          <div className="ai-upload-section">
            <h2>이미지 업로드</h2>
            <p>사진을 업로드하면 AI가 분위기를 분석하여 어울리는 칵테일을 추천해드립니다</p>

            {!imagePreview ? (
              <div
                className="upload-dropzone"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="image-upload"
                  className="upload-input"
                />
                <label htmlFor="image-upload" className="upload-label">
                  <Upload size={40} aria-hidden="true" />
                  <span>이미지를 여기에 드롭하거나 클릭하여 업로드</span>
                  <span className="upload-hint">jpg, png 지원</span>
                </label>
              </div>
            ) : (
              /* 수직 정렬을 위한 새 컨테이너 적용 부분 */
              <div className="preview-with-button animate-fade-in">
                <div className="upload-preview">
                  <img src={imagePreview} alt="업로드된 이미지 미리보기" className="preview-image" />
                  <button className="preview-clear" onClick={clearImage} aria-label="이미지 삭제">
                    <X size={20} />
                  </button>
                </div>

                {/* 이미지 분석 버튼을 사진 바로 아래 배치 */}
                {!moodAnalysis && (
                  <Button
                    size="large"
                    onClick={analyzeImage}
                    loading={aiLoading}
                    icon={<Image size={18} />}
                  >
                    이미지 분석
                  </Button>
                )}
              </div>
            )}
          </div>

          {moodAnalysis && (
            <div className="ai-results animate-slide-up">
              <div className="mood-analysis">
                <h3>분위기 분석</h3>
                <p className="mood-description">{moodAnalysis.description}</p>
                <div className="mood-tags">
                  {moodAnalysis.mood.map((tag) => (
                    <span key={tag} className="mood-tag">{tag}</span>
                  ))}
                </div>
                <p className="mood-type">
                  추천 유형: <strong>{moodAnalysis.cocktailType}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {aiCocktails.length > 0 && (
                <div className="ai-cocktails">
                  <h3>추천 칵테일</h3>
                  <div className="cocktails-grid">
                    {aiCocktails.map((cocktail) => (
                      <div
                        key={cocktail.idDrink}
                        onMouseEnter={() => handleCardHover(cocktail)}
                      >
                        <CocktailCard
                          cocktail={cocktail}
                          onClick={onCocktailClick}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
    </div>
  )
}

export default AiTab

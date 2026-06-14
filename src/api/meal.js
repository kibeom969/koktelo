const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

/**
 * 💡 핵심 로직: 캐싱 + 타임아웃(8초) + 자동 재시도
 * @param {string} url 요청할 API 주소
 * @param {boolean} cacheable 캐시 사용 여부 (랜덤 메뉴 등은 false)
 * @param {number} retries 실패 시 재시도 횟수
 */
async function fetchWithCache(url, cacheable = true, retries = 2) {
  // 1. 캐시 확인
  if (cacheable) {
    const cachedData = sessionStorage.getItem(url)
    if (cachedData) {
      return JSON.parse(cachedData)
    }
  }

  // 2. API 요청 및 재시도 로직
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const data = await response.json()

      // 3. 성공적으로 받아온 데이터 저장
      if (cacheable && data) {
        sessionStorage.setItem(url, JSON.stringify(data))
      }

      return data
    } catch (error) {
      const isLastAttempt = i === retries
      if (isLastAttempt) {
        console.error(`❌ API 통신 최종 실패 (${url}):`, error)
        return null
      }
      console.warn(`⚠️ API 응답 지연/실패. 재시도 중... (${i + 1}/${retries})`)
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}

// ============================================================================
// 아래부터는 fetch 대신 fetchWithCache를 사용하도록 모두 수정됨
// ============================================================================

export async function getRandomMeal() {
  // 📌 랜덤 식사는 매번 결과가 달라야 하므로 캐시를 사용하지 않습니다.
  const data = await fetchWithCache(`${BASE_URL}/random.php`, false)
  return data?.meals ? data.meals[0] : null
}

export async function searchMealsByName(name) {
  const data = await fetchWithCache(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`)
  return data?.meals || []
}

export async function getMealById(id) {
  const data = await fetchWithCache(`${BASE_URL}/lookup.php?i=${id}`)
  return data?.meals ? data.meals[0] : null
}

export async function filterMealsByCategory(category) {
  const data = await fetchWithCache(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`)
  return data?.meals || []
}

export async function getMealCategories() {
  const data = await fetchWithCache(`${BASE_URL}/categories.php`)
  return data?.categories || []
}

// 이 함수는 내부적으로 searchMealsByName를 사용하므로 알아서 캐싱 효과를 받습니다.
export async function searchMealByMultipleTerms(terms) {
  for (const term of terms) {
    const meals = await searchMealsByName(term)
    if (meals && meals.length > 0) {
      return meals[0]
    }
  }
  return null
}

// ============================================================================
// 유틸리티 함수 (기존 로직 그대로 유지)
// ============================================================================

export function extractMealIngredients(meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : ''
      })
    }
  }
  return ingredients
}

export function getMealIngredientImage(ingredientName) {
  return `https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredientName)}-Small.png`
}

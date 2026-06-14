const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1'

/**
 * 💡 추가된 핵심 로직: 캐싱 + 타임아웃 + 자동 재시도
 * @param {string} url 요청할 API 주소
 * @param {boolean} cacheable 캐시 사용 여부 (랜덤 칵테일 등은 false로 둬야 함)
 * @param {number} retries 실패 시 재시도 횟수
 */
async function fetchWithCache(url, cacheable = true, retries = 3) {
  // 1. 캐시 확인: 이미 저장된 데이터가 있으면 바로 꺼내서 반환 (서버 요청 안 함)
  if (cacheable) {
    const cachedData = sessionStorage.getItem(url)
    if (cachedData) {
      return JSON.parse(cachedData)
    }
  }

  // 2. API 요청 및 재시도 로직
  for (let i = 0; i <= retries; i++) {
    try {
      // 무한 로딩 방지: 8초가 지나면 강제로 요청을 취소 (AbortController)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const data = await response.json()

      // 3. 성공적으로 받아온 데이터는 sessionStorage에 저장
      if (cacheable && data) {
        sessionStorage.setItem(url, JSON.stringify(data))
      }

      return data
    } catch (error) {
      const isLastAttempt = i === retries
      if (isLastAttempt) {
        console.error(`❌ API 통신 최종 실패 (${url}):`, error)
        return null // 에러로 인해 화면이 하얗게 터지는 것을 방지
      }
      console.warn(`⚠️ API 응답 지연/실패. 재시도 중... (${i + 1}/${retries})`)
      // 실패 시 약간 대기 후 다시 시도 (1초 -> 2초)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)))
    }
  }
}

// ============================================================================
// 아래부터는 fetch 대신 fetchWithCache를 사용하도록 모두 수정됨
// ============================================================================

export async function searchCocktailsByName(name) {
  const data = await fetchWithCache(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`)
  return data?.drinks || []
}

export async function searchCocktailsByFirstLetter(letter) {
  const data = await fetchWithCache(`${BASE_URL}/search.php?f=${letter}`)
  return data?.drinks || []
}

export async function getCocktailById(id) {
  const data = await fetchWithCache(`${BASE_URL}/lookup.php?i=${id}`)
  return data?.drinks ? data.drinks[0] : null
}

export async function getRandomCocktail() {
  // 📌 랜덤 칵테일은 매번 결과가 달라야 하므로 캐시를 사용하지 않습니다. (두 번째 인자 false)
  const data = await fetchWithCache(`${BASE_URL}/random.php`, false)
  return data?.drinks ? data.drinks[0] : null
}

export async function filterByIngredient(ingredient) {
  const data = await fetchWithCache(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`)
  return data?.drinks || []
}

export async function filterByCategory(category) {
  const data = await fetchWithCache(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`)
  return data?.drinks || []
}

export async function filterByGlass(glass) {
  const data = await fetchWithCache(`${BASE_URL}/filter.php?g=${encodeURIComponent(glass)}`)
  return data?.drinks || []
}

export async function filterByAlcoholic(type) {
  const data = await fetchWithCache(`${BASE_URL}/filter.php?a=${encodeURIComponent(type)}`)
  return data?.drinks || []
}

export async function getIngredientsList() {
  const data = await fetchWithCache(`${BASE_URL}/list.php?i=list`)
  return data?.drinks || []
}

export async function getCategoriesList() {
  const data = await fetchWithCache(`${BASE_URL}/list.php?c=list`)
  return data?.drinks || []
}

export async function getGlassesList() {
  const data = await fetchWithCache(`${BASE_URL}/list.php?g=list`)
  return data?.drinks || []
}

export async function getAlcoholicFiltersList() {
  const data = await fetchWithCache(`${BASE_URL}/list.php?a=list`)
  return data?.drinks || []
}

// 아래의 이미지 URL 생성 및 재료 추출 함수는 기존 코드 그대로 유지
export function getIngredientImage(ingredientName) {
  return `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(ingredientName)}-Medium.png`
}

export function extractIngredients(cocktail) {
  const ingredients = []
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`]
    const measure = cocktail[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : ''
      })
    }
  }
  return ingredients
}

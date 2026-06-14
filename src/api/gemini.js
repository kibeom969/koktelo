const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function analyzeImageMood(imageBase64) {
  if (!GEMINI_API_KEY) {
    return getDemoMoodAnalysis()
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this image and describe its mood/atmosphere in a few keywords. 
                  Then suggest what type of cocktail would match this mood.
                  
                  Respond in JSON format(checking exists ingredients by thecocktaildb):
                  {
                    "mood": ["keyword1", "keyword2", "keyword3"],
                    "description": "Brief description of the atmosphere",
                    "cocktailType": "Type of cocktail in a word",
                    "suggestedIngredients": ["ingredient1", "ingredient2"]
                  }`
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2500
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to analyze image')
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    return getDemoMoodAnalysis()
  } catch (error) {
    console.error('Gemini API error:', error)
    return getDemoMoodAnalysis()
  }
}

export async function recommendFoodPairings(cocktailName, cocktailCategory, cocktailIngredients) {
  if (!GEMINI_API_KEY) {
    return getDemoFoodPairings(cocktailName)
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a food and cocktail pairing expert. 
                  
Given the following cocktail information:
- Name: ${cocktailName}
- Category: ${cocktailCategory}
- Main ingredients: ${cocktailIngredients.join(', ')}

Recommend 3 DIFFERENT types of food that pair well with this cocktail. Each food should be from a different cuisine or category to offer variety.

Respond in JSON format only (no other text):
{
  "pairings": [
    {
      "foodName": "Name of the recommended food in English (should be searchable in TheMealDB)",
      "foodNameKorean": "Name of the recommended food in Korean",
      "reason": "Explanation in Korean why this food pairs well with this cocktail (1-2 sentences)",
      "searchTerms": ["search term 1", "search term 2"]
    },
    {
      "foodName": "...",
      "foodNameKorean": "...",
      "reason": "...",
      "searchTerms": ["..."]
    },
    {
      "foodName": "...",
      "foodNameKorean": "...",
      "reason": "...",
      "searchTerms": ["..."]
    }
  ]
}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2500
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to get food recommendation')
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return parsed.pairings || getDemoFoodPairings(cocktailName)
    }
    
    return getDemoFoodPairings(cocktailName)
  } catch (error) {
    console.error('Gemini API error:', error)
    return getDemoFoodPairings(cocktailName)
  }
}

export async function translateToKorean(text) {
  if (!GEMINI_API_KEY || !text) {
    return text
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Translate the following cocktail recipe instructions into natural Korean. Keep ingredient names as-is (do not translate ingredient names). Only return the translated text, no explanations.

Text to translate:
${text}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2500
          }
        })
      }
    )

   console.log("status:", response.status)

if (!response.ok) {
  const errorText = await response.text()

  console.log("Gemini Error:", errorText)

  throw new Error("Translation failed")
}

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

// Keep backward compatibility
export async function recommendFoodPairing(cocktailName, cocktailCategory, cocktailIngredients) {
  const pairings = await recommendFoodPairings(cocktailName, cocktailCategory, cocktailIngredients)
  return pairings[0]
}

function getDemoMoodAnalysis() {
  const moods = [
    {
      mood: ['romantic', 'warm', 'intimate'],
      description: 'A cozy and romantic atmosphere perfect for an evening drink',
      cocktailType: 'sweet',
      suggestedIngredients: ['Champagne', 'Strawberry', 'Vodka']
    },
    {
      mood: ['energetic', 'vibrant', 'fun'],
      description: 'A lively and exciting atmosphere full of energy',
      cocktailType: 'tropical',
      suggestedIngredients: ['Rum', 'Pineapple', 'Coconut']
    },
    {
      mood: ['calm', 'relaxed', 'peaceful'],
      description: 'A serene and tranquil setting for unwinding',
      cocktailType: 'refreshing',
      suggestedIngredients: ['Gin', 'Tonic', 'Lime']
    },
    {
      mood: ['sophisticated', 'elegant', 'classic'],
      description: 'An upscale and refined atmosphere',
      cocktailType: 'strong',
      suggestedIngredients: ['Whiskey', 'Vermouth', 'Bitters']
    },
    {
      mood: ['adventurous', 'exotic', 'mysterious'],
      description: 'An intriguing atmosphere that sparks curiosity',
      cocktailType: 'exotic',
      suggestedIngredients: ['Tequila', 'Mezcal', 'Agave']
    }
  ]
  
  return moods[Math.floor(Math.random() * moods.length)]
}







function getDemoFoodPairings(cocktailName) {
  const allPairings = [
    {
      foodName: 'Bruschetta',
      foodNameKorean: '브루스케타',
      reason: '가볍고 상큼한 토마토와 바질의 조합이 칵테일의 풍미를 더욱 살려줍니다.',
      searchTerms: ['Bruschetta', 'Tomato', 'Italian']
    },
    {
      foodName: 'Shrimp',
      foodNameKorean: '새우 요리',
      reason: '해산물의 담백한 맛이 칵테일의 깔끔한 맛과 잘 어울립니다.',
      searchTerms: ['Shrimp', 'Prawn', 'Seafood']
    },
    {
      foodName: 'Tacos',
      foodNameKorean: '타코',
      reason: '매콤하고 풍부한 맛의 타코가 칵테일의 상쾌함과 완벽한 균형을 이룹니다.',
      searchTerms: ['Taco', 'Mexican', 'Beef']
    },
    {
      foodName: 'Salmon',
      foodNameKorean: '연어 구이',
      reason: '연어의 부드럽고 풍부한 맛이 칵테일과 훌륭하게 조화됩니다.',
      searchTerms: ['Salmon', 'Fish', 'Seafood']
    },
    {
      foodName: 'Cheese',
      foodNameKorean: '치즈 플래터',
      reason: '다양한 치즈의 풍부한 맛이 칵테일의 복잡한 향과 맛을 보완해줍니다.',
      searchTerms: ['Cheese', 'Fondue', 'Dairy']
    },
    {
      foodName: 'Chicken',
      foodNameKorean: '치킨 요리',
      reason: '바삭하고 풍미 있는 치킨이 칵테일의 청량감과 잘 어울립니다.',
      searchTerms: ['Chicken', 'Fried chicken', 'Wings']
    }
  ]
  
  // Shuffle and return 3 different pairings
  const shuffled = [...allPairings].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

export function isGeminiConfigured() {
  return !!GEMINI_API_KEY
}

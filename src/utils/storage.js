const USERS_KEY = 'cocktail_users'
const CURRENT_USER_KEY = 'cocktail_current_user'
const MY_INGREDIENTS_KEY = 'cocktail_my_ingredients'
const FAVORITES_KEY = 'cocktail_favorites'


export function getUsers() {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function findUserByEmail(email) {
  const users = getUsers()
  return users.find(user => user.email === email)
}

export function createUser(email, password, name) {
  const users = getUsers()
  
  if (findUserByEmail(email)) {
    return { success: false, error: 'Email already exists' }
  }
  
  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    name,
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  saveUsers(users)
  
  return { success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } }
}

export function validateUser(email, password) {
  const user = findUserByEmail(email)
  
  if (!user) {
    return { success: false, error: 'User not found' }
  }
  
  if (user.password !== password) {
    return { success: false, error: 'Invalid password' }
  }
  
  return { success: true, user: { id: user.id, email: user.email, name: user.name } }
}

export function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function getMyIngredients(userId) {
  const key = `${MY_INGREDIENTS_KEY}_${userId}`
  const ingredients = localStorage.getItem(key)
  return ingredients ? JSON.parse(ingredients) : []
}

export function saveMyIngredients(userId, ingredients) {
  const key = `${MY_INGREDIENTS_KEY}_${userId}`
  localStorage.setItem(key, JSON.stringify(ingredients))
}

export function addMyIngredient(userId, ingredient) {
  const ingredients = getMyIngredients(userId)
  if (!ingredients.includes(ingredient)) {
    ingredients.push(ingredient)
    saveMyIngredients(userId, ingredients)
  }
  return ingredients
}

export function removeMyIngredient(userId, ingredient) {
  const ingredients = getMyIngredients(userId)
  const filtered = ingredients.filter(i => i !== ingredient)
  saveMyIngredients(userId, filtered)
  return filtered
}

export function getFavorites(userId) {
  const key = `${FAVORITES_KEY}_${userId}`
  const favorites = localStorage.getItem(key)
  return favorites ? JSON.parse(favorites) : []
}

export function saveFavorites(userId, favorites) {
  const key = `${FAVORITES_KEY}_${userId}`
  localStorage.setItem(key, JSON.stringify(favorites))
}

export function toggleFavorite(userId, cocktailId) {
  const favorites = getFavorites(userId)
  const index = favorites.indexOf(cocktailId)
  
  if (index === -1) {
    favorites.push(cocktailId)
  } else {
    favorites.splice(index, 1)
  }
  
  saveFavorites(userId, favorites)
  return favorites
}

export function isFavorite(userId, cocktailId) {
  const favorites = getFavorites(userId)
  return favorites.includes(cocktailId)
}

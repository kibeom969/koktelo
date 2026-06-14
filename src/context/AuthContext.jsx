import { createContext, useState, useEffect } from 'react'
import { 
  getCurrentUser, 
  setCurrentUser, 
  createUser, 
  validateUser,
  getMyIngredients,
  saveMyIngredients,
  getFavorites,
  toggleFavorite as toggleFavoriteStorage,
} from '../utils/storage'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myIngredients, setMyIngredients] = useState([])
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const storedUser = getCurrentUser()
    if (storedUser) {
      setUser(storedUser)
      setMyIngredients(getMyIngredients(storedUser.id))
      setFavorites(getFavorites(storedUser.id))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const result = validateUser(email, password)
    if (result.success) {
      setUser(result.user)
      setCurrentUser(result.user)
      setMyIngredients(getMyIngredients(result.user.id))
      setFavorites(getFavorites(result.user.id))
    }
    return result
  }

  const signup = (email, password, name) => {
    const result = createUser(email, password, name)
    if (result.success) {
      setUser(result.user)
      setCurrentUser(result.user)
      setMyIngredients([])
      setFavorites([])
    }
    return result
  }

  const logout = () => {
    setUser(null)
    setCurrentUser(null)
    setMyIngredients([])
    setFavorites([])
  }

  const updateMyIngredients = (ingredients) => {
    if (user) {
      saveMyIngredients(user.id, ingredients)
      setMyIngredients(ingredients)
    }
  }

  const toggleFavorite = (cocktailId) => {
    if (user) {
      const newFavorites = toggleFavoriteStorage(user.id, cocktailId)
      setFavorites(newFavorites)
      return newFavorites
    }
    return []
  }

  const isFavorited = (cocktailId) => {
    return favorites.includes(cocktailId)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    myIngredients,
    favorites,
    login,
    signup,
    logout,
    updateMyIngredients,
    toggleFavorite,
    isFavorited
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// useAuth는 src/context/useAuth.js 에서 import 하세요.
// 하위 호환성을 위해 여기서도 re-export 합니다.
export { useAuth } from './useAuth'

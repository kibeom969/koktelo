// src/hooks/useCocktailModal.js
import { useState } from 'react'

/**
 * 칵테일 카드 클릭 -> 모달 열기/닫기 로직을 공통으로 관리하는 훅
 */
export function useCocktailModal() {
  const [selectedCocktail, setSelectedCocktail] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = (cocktail) => {
    setSelectedCocktail(cocktail)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  return { selectedCocktail, modalOpen, openModal, closeModal }
}

// src/pages/Encyclopedia.jsx
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { useEncyclopediaData } from "../hooks/useEncyclopediaData";
import { useCocktailModal } from "../hooks/useCocktailModal";
import CocktailGrid from "../components/cocktail/CocktailGrid";
import CocktailDetail from "../components/cocktail/CocktailDetail";
import CocktailDetailSkeleton from "../components/cocktail/CocktailDetailSkeleton";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import "./Encyclopedia.css";

const LETTERS = ["all", ..."abcdefghijklmnopqrstvwyz".split("")];

function Encyclopedia() {
  const {
    filteredCocktails,
    loading,
    detailLoading,
    searchTerm,
    setSearchTerm,
    selectedLetter,
    setSelectedLetter,
    categories,
    glasses,
    alcoholicTypes,
    selectedCategory,
    setSelectedCategory,
    selectedGlass,
    setSelectedGlass,
    selectedAlcoholic,
    setSelectedAlcoholic,
    hasActiveFilter,
    activeFilterCount,
    fetchCocktailDetail,
  } = useEncyclopediaData();

  const { selectedCocktail, modalOpen, openModal, closeModal } =
    useCocktailModal();
  const [showFilters, setShowFilters] = useState(false);

  const handleCocktailClick = (cocktail) => {
    openModal(cocktail);
    fetchCocktailDetail(cocktail, (full) => openModal(full));
  };

  return (
    <div className="encyclopedia">
      <div className="container">
        {/* 헤더 */}
        <div className="encyclopedia-header">
          <h1 className="encyclopedia-title">칵테일 도감</h1>
          <p className="encyclopedia-subtitle">
            {filteredCocktails.length > 0
              ? `${filteredCocktails.length}개의`
              : ""}{" "}
            칵테일 레시피를 탐험하세요
          </p>
        </div>

        {/* 검색 + 필터 바 */}
        <div className="encyclopedia-controls">
          <div className="search-wrapper">
            <Input
              placeholder="칵테일 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              fullWidth
            />
          </div>
          <Button
            variant={showFilters ? "primary" : "secondary"}
            icon={<Filter size={18} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            필터
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </Button>
        </div>

        {/* 필터 패널 */}
        {showFilters && (
          <div className="filters-panel animate-slide-down">
            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-category">
                카테고리
              </label>
              <select
                id="filter-category"
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">전체 카테고리</option>
                {categories
                  // 'cocoa' 항목만 제외 (대소문자 구분 없이 처리하려면 toLowerCase 사용)
                  .filter((cat) => cat.toLowerCase() !== "cocoa")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-glass">
                잔 종류
              </label>
              <select
                id="filter-glass"
                className="filter-select"
                value={selectedGlass}
                onChange={(e) => setSelectedGlass(e.target.value)}
              >
                <option value="">전체 잔</option>
                {glasses.map((glass) => (
                  <option key={glass} value={glass}>
                    {glass}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label" htmlFor="filter-alcoholic">
                알코올 유형
              </label>
              <select
                id="filter-alcoholic"
                className="filter-select"
                value={selectedAlcoholic}
                onChange={(e) => setSelectedAlcoholic(e.target.value)}
              >
                <option value="">전체 유형</option>
                {alcoholicTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 알파벳 네비게이션 */}
        <nav className="letter-nav" aria-label="알파벳 필터">
          {LETTERS.map((letter) => (
            <button
              key={letter}
              className={`letter-btn${selectedLetter === letter ? " letter-btn--active" : ""}`}
              onClick={() => setSelectedLetter(letter)}
              aria-pressed={selectedLetter === letter}
            >
              {letter === "all" ? "전체" : letter.toUpperCase()}
            </button>
          ))}
        </nav>

        {/* 결과 */}
        <div className="encyclopedia-results">
          <CocktailGrid
            cocktails={filteredCocktails}
            loading={loading}
            onCocktailClick={handleCocktailClick}
            emptyMessage={
              searchTerm
                ? `"${searchTerm}"에 대한 칵테일을 찾을 수 없습니다`
                : hasActiveFilter
                  ? "선택한 필터에 맞는 칵테일이 없습니다"
                  : selectedLetter !== "all"
                    ? `"${selectedLetter.toUpperCase()}"로 시작하는 칵테일이 없습니다`
                    : "칵테일을 찾을 수 없습니다"
            }
          />
        </div>
      </div>

      {/* 상세 모달 */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title="칵테일 상세정보"
        size="large"
      >
        {detailLoading ? (
          <CocktailDetailSkeleton />
        ) : (
          <CocktailDetail cocktail={selectedCocktail} />
        )}
      </Modal>
    </div>
  );
}

export default Encyclopedia;

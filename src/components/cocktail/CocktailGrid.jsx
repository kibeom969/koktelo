import CocktailCard from "./CocktailCard";
import "./CocktailGrid.css";
import { useState, useEffect } from "react";
import Button from "../common/Button";

function CocktailGrid({
  cocktails,
  loading,
  onCocktailClick,
  emptyMessage = "No cocktails found",
}) {
  const [number, setNumber] = useState(24);
  let numberLimit = () => {
    setNumber(number + 16);
  };
  useEffect(() => {
    setNumber(24);
  }, [cocktails]);

  if (loading) {
    return (
      <div className="cocktail-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="cocktail-card-skeleton" aria-hidden="true">
            <div className="ccs-image" />
            <div className="ccs-content">
              <div className="ccs-title" />
              <div className="ccs-badge" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!cocktails || cocktails.length === 0) {
    return (
      <div className="cocktail-grid-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }
  const hasMore = number < cocktails.length;
  return (
    <div>
      <div className="cocktail-grid">
        {cocktails.slice(0, number).map((cocktail) => (
          <CocktailCard
            key={cocktail.idDrink}
            cocktail={cocktail}
            onClick={onCocktailClick}
          />
        ))}
      </div>
      {hasMore && (
        <Button
          style={{ width: "100%", height: "60px", marginTop: "20px" }}
          onClick={numberLimit}
        >
          더보기
        </Button>
      )}
    </div>
  );
}

export default CocktailGrid;

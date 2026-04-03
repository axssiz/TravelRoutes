// client/src/components/StarRating.jsx
import React from "react";
import "../styles/StarRating.css";

export const StarRating = ({ rating, onRatingChange, maxStars = 5 }) => {
  const handleStarClick = (starValue) => {
    onRatingChange(starValue);
  };

  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= maxStars) {
      onRatingChange(value);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      const isFilled = i <= Math.floor(rating);
      const isPartial = i === Math.ceil(rating) && rating % 1 !== 0;
      const partialWidth = (rating % 1) * 100;

      stars.push(
        <span
          key={i}
          className={`star ${isFilled ? "filled" : ""} ${isPartial ? "partial" : ""}`}
          onClick={() => handleStarClick(i)}
          style={isPartial ? { "--partial-width": `${partialWidth}%` } : {}}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  return (
    <div className="star-rating-container">
      <div className="stars">{renderStars()}</div>
      <input
        type="number"
        value={rating}
        onChange={handleInputChange}
        min="0"
        max={maxStars}
        step="0.1"
        className="rating-input"
        placeholder="0.0"
      />
    </div>
  );
};

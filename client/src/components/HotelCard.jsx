// client/src/components/HotelCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { favoritesAPI } from "../services/api.js";
import { toastSuccess, toastError } from "../utils/toast.js";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/HotelCard.css";

export const HotelCard = ({ hotel, onFavoriteChange }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  // Проверка статуса избранного при загрузке
  React.useEffect(() => {
    if (isAuthenticated && hotel?.id) {
      checkFavoriteStatus();
    }
  }, [hotel?.id, isAuthenticated]);

  // Логирование для диагностики
  React.useEffect(() => {
    console.log("[HotelCard] Hotel data:", {
      name: hotel.name,
      imageUrl: hotel.imageUrl,
      hasImageUrl: !!hotel.imageUrl,
    });
  }, [hotel]);

  const checkFavoriteStatus = async () => {
    if (!isAuthenticated) {
      setIsFavorite(false);
      setFavoriteId(null);
      return;
    }

    try {
      const res = await favoritesAPI.getAll();
      const favorite = res.data.data?.find((fav) => fav.hotel?.id === hotel.id);
      if (favorite) {
        setIsFavorite(true);
        setFavoriteId(favorite.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      console.error("[HotelCard] Error checking favorite status:", error);
      // При ошибке сбрасываем статус избранного
      setIsFavorite(false);
      setFavoriteId(null);
    }
  };

  const handleImageError = () => {
    console.warn(
      `[HotelCard] Image load failed for ${hotel.name}:`,
      hotel.imageUrl,
    );
    setImageError(true);
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toastError("Пожалуйста, войдите в свой аккаунт");
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        // Удаление из избранного
        await favoritesAPI.remove(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
        toastSuccess("Удалено из избранного");
        onFavoriteChange?.();
      } else {
        // Добавление в избранное
        const res = await favoritesAPI.addHotel(hotel.id);
        setIsFavorite(true);
        setFavoriteId(res.data.data.id);
        toastSuccess("Добавлено в избранное");
        onFavoriteChange?.();
      }
    } catch (error) {
      toastError(error.response?.data?.error || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/hotels/${hotel.id}`} className="hotel-card-link">
      <div className="hotel-card">
        <div className="hotel-image-wrapper">
          {imageError ? (
            <div className="hotel-image-placeholder">
              <span className="placeholder-icon">📷</span>
              <p>Изображение не доступно</p>
            </div>
          ) : (
            <img
              src={hotel.imageUrl}
              alt={hotel.name}
              className="hotel-image"
              onError={handleImageError}
            />
          )}
          <button
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
            disabled={loading}
          >
            <span className="heart-icon">
              {isFavorite ? <FaHeart color="white" /> : <FaRegHeart />}
            </span>
          </button>
          <div className="hotel-badge">{hotel.city}</div>
        </div>

        <div className="hotel-info">
          <h3 className="hotel-name">{hotel.name}</h3>
          <p className="hotel-description">
            {hotel.description.substring(0, 80)}...
          </p>

          <div className="hotel-footer">
            <div className="rating">
              <span className="star">★</span> {hotel.rating.toFixed(1)}
            </div>
            <div className="price">${hotel.price}/ночь</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

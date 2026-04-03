// client/src/pages/Favorites.jsx
import React, { useState, useEffect } from "react";
import { favoritesAPI } from "../services/api.js";
import { HotelCard } from "../components/HotelCard.jsx";
import { toastError } from "../utils/toast.js";
import { FaHeart } from "react-icons/fa";
import "../styles/Favorites.css";

export const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, hotels, routes

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await favoritesAPI.getAll();
      setFavorites(res.data.data);
    } catch (error) {
      toastError("Ошибка загрузки избранного");
    } finally {
      setLoading(false);
    }
  };

  const filteredFavorites = favorites.filter((fav) => {
    if (filter === "hotels") return fav.hotel;
    if (filter === "routes") return fav.route;
    return true;
  });

  const hotels = filteredFavorites.filter((f) => f.hotel);
  const routes = filteredFavorites.filter((f) => f.route);

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1>
          <span className="page-title-icon">
            <FaHeart />
          </span>{" "}
          Мое избранное
        </h1>
      </div>

      <div className="favorites-filters">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          Все ({filteredFavorites.length})
        </button>
        <button
          className={`filter-btn ${filter === "hotels" ? "active" : ""}`}
          onClick={() => setFilter("hotels")}
        >
          Отели ({hotels.length})
        </button>
        <button
          className={`filter-btn ${filter === "routes" ? "active" : ""}`}
          onClick={() => setFilter("routes")}
        >
          Маршруты ({routes.length})
        </button>
      </div>

      <div className="favorites-content">
        {loading ? (
          <p className="loading">Загрузка...</p>
        ) : filteredFavorites.length > 0 ? (
          <>
            {/* Отели */}
            {(filter === "all" || filter === "hotels") && hotels.length > 0 && (
              <section className="favorites-section">
                <h2>
                  <span className="section-icon">⌂</span> Избранные отели
                </h2>
                <div className="hotels-grid">
                  {hotels.map((fav) => (
                    <HotelCard
                      key={fav.id}
                      hotel={fav.hotel}
                      onFavoriteChange={loadFavorites}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Маршруты */}
            {(filter === "all" || filter === "routes") && routes.length > 0 && (
              <section className="favorites-section">
                <h2>
                  <span className="section-icon">◇</span> Избранные маршруты
                </h2>
                <div className="routes-list">
                  {routes.map((fav) => (
                    <div key={fav.id} className="route-item">
                      <div className="route-info">
                        <h3>
                          {fav.route.startLocation} → {fav.route.endLocation}
                        </h3>
                        <p>
                          {fav.route.distance} км • {fav.route.duration} мин
                        </p>
                      </div>
                      <button className="btn btn-small">Подробнее</button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p className="empty-icon">▭</p>
            <h2>Ваше избранное пусто</h2>
            <p>Начните добавлять отели и маршруты в избранное</p>
          </div>
        )}
      </div>
    </div>
  );
};

// client/src/pages/Hotels.jsx
import React, { useState, useEffect } from "react";
import { hotelsAPI } from "../services/api.js";
import { HotelCard } from "../components/HotelCard.jsx";
import { HotelGridSkeleton } from "../components/LoadingSkeletons.jsx";
import { toastError } from "../utils/toast.js";
import "../styles/Hotels.css";

export const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({});

  // Загрузка отелей
  useEffect(() => {
    loadHotels();
  }, [filters]);

  // Загрузка городов для вычиволеписка отелей
  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await hotelsAPI.getCities();
        setCities(res.data.data);
      } catch (error) {
        console.error("Ошибка загрузки городов:", error);
      }
    };

    loadCities();
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const params = {
        city: filters.city || undefined,
        page: filters.page,
        limit: filters.limit,
      };

      if (filters.minPrice !== "") {
        params.minPrice = Number(filters.minPrice);
      }
      if (filters.maxPrice !== "") {
        params.maxPrice = Number(filters.maxPrice);
      }
      if (filters.minRating !== "") {
        params.minRating = Number(filters.minRating);
      }

      const res = await hotelsAPI.getAll(params);
      setHotels(res.data.data.hotels);
      setPagination(res.data.data.pagination);
    } catch (error) {
      toastError("Ошибка загрузки отелей");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
      page: 1, // Сброс на первую страницу
    });
  };

  const handleResetFilters = () => {
    setFilters({
      city: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      page: 1,
      limit: 12,
    });
  };

  return (
    <div className="hotels-page">
      <div className="hotels-container">
        {/* Фильтры */}
        <aside className="filters-sidebar">
          <h3>Фильтры</h3>

          <div className="filter-group">
            <label>Город</label>
            <select
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
            >
              <option value="">Все города</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Минимальная цена</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="От"
              min="0"
            />
          </div>

          <div className="filter-group">
            <label>Максимальная цена</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="До"
              min="0"
            />
          </div>

          <div className="filter-group">
            <label>Минимальный рейтинг</label>
            <input
              type="number"
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              placeholder="0-5"
              min="0"
              max="5"
              step="0.1"
            />
          </div>

          <button className="btn btn-secondary" onClick={handleResetFilters}>
            Сбросить фильтры
          </button>
        </aside>

        {/* Отели */}
        <main className="hotels-main">
          {loading ? (
            <HotelGridSkeleton />
          ) : hotels.length > 0 ? (
            <>
              <div className="hotels-grid">
                {hotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onFavoriteChange={loadHotels}
                  />
                ))}
              </div>

              {/* Пагинация */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-secondary"
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setFilters({ ...filters, page: pagination.page - 1 })
                    }
                  >
                    Назад
                  </button>

                  <span className="pagination-info">
                    Страница {pagination.page} из {pagination.pages}
                  </span>

                  <button
                    className="btn btn-secondary"
                    disabled={pagination.page === pagination.pages}
                    onClick={() =>
                      setFilters({ ...filters, page: pagination.page + 1 })
                    }
                  >
                    Вперед
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <p>😞 Отели не найдены</p>
              <p>Попробуйте изменить фильтры</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

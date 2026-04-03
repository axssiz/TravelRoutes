import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Polyline,
  Marker,
} from "@react-google-maps/api";
import { KAZAKHSTAN_CITIES, CITY_COORDINATES } from "../constants/cities.js";
import routesService from "../services/routesService.js";
import { hotelsAPI } from "../services/api.js";
import {
  FaSearch,
  FaArrowsAltV,
  FaMapMarkerAlt,
  FaRoad,
  FaClock,
  FaRulerHorizontal,
  FaInfoCircle,
  FaExclamationCircle,
  FaCheckCircle,
  FaCircleNotch,
  FaStop,
  FaHotel,
  FaTimes,
  FaStar,
  FaDollarSign,
} from "react-icons/fa";
import "../styles/routePlanner.css";

export const RouteSearch = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [polylinePath, setPolylinePath] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 48.5, lng: 67.5 }); // Центр Казахстана
  const [mapInstance, setMapInstance] = useState(null);
  const [apiKey] = useState(process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "");
  const [selectedCity, setSelectedCity] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [showHotelsModal, setShowHotelsModal] = useState(false);

  // Отслеживание изменений полилинии для отладки
  useEffect(() => {
    console.log("🔄 PolylinePath обновлен:", polylinePath);
  }, [polylinePath]);

  useEffect(() => {
    console.log("🔄 MapCenter обновлен:", mapCenter);
  }, [mapCenter]);

  // Принудительное обновление карты при изменении маршрута
  useEffect(() => {
    if (polylinePath.length > 0) {
      console.log("🎯 Маршрут готов к отображению:", polylinePath);
    }

    if (mapInstance && polylinePath.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      polylinePath.forEach((point) => bounds.extend(point));
      mapInstance.fitBounds(bounds);

      // огранизация зума, чтобы не было слишком близко/далеко
      const currentZoom = mapInstance.getZoom();
      if (currentZoom > 8) {
        mapInstance.setZoom(8);
      }
    }
  }, [polylinePath, route, mapInstance]);

  // Фильтрация городов для выпадающего списка "Откуда"
  const getFilteredCities = (input, excludeCity = "") => {
    return KAZAKHSTAN_CITIES.filter(
      (city) =>
        city.toLowerCase().includes(input.toLowerCase()) &&
        city !== excludeCity,
    );
  };

  const handleFromSelect = (city) => {
    setFrom(city);
    setFromInput(city);
    setFromOpen(false);
  };

  const handleToSelect = (city) => {
    setTo(city);
    setToInput(city);
    setToOpen(false);
  };

  const handleFromInputChange = (e) => {
    setFromInput(e.target.value);
    setFrom("");
    setFromOpen(true);
  };

  const handleToInputChange = (e) => {
    setToInput(e.target.value);
    setTo("");
    setToOpen(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");

    if (!from || !to) {
      setError("❌ Выберите города");
      return;
    }

    if (from === to) {
      setError("❌ Выберите разные города");
      return;
    }

    setLoading(true);
    console.log("🔍 Начинаем поиск маршрута:", from, "→", to);

    setTimeout(() => {
      try {
        const result = routesService.findRoute(from, to);
        console.log("📍 Найденный маршрут:", result);
        setRoute(result);
        generatePolyline(from, to);
        console.log("✅ Маршрут успешно загружен");
      } catch (err) {
        console.error("❌ Ошибка при поиске маршрута:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const generatePolyline = (from, to) => {
    const coords = CITY_COORDINATES;
    console.log("🗺️ Генерация полилинии для:", from, "→", to);
    console.log("📍 Координаты из базы:", coords[from], coords[to]);

    if (coords[from] && coords[to]) {
      const path = [coords[from], coords[to]];
      console.log("✅ Путь создан:", path);

      // Проверяем, что координаты в правильном формате
      const isValidCoords = path.every(
        (coord) =>
          typeof coord.lat === "number" &&
          typeof coord.lng === "number" &&
          coord.lat >= -90 &&
          coord.lat <= 90 &&
          coord.lng >= -180 &&
          coord.lng <= 180,
      );

      if (!isValidCoords) {
        console.error("❌ Некорректные координаты:", path);
        return;
      }

      setPolylinePath(path);

      // Установить центр карты посередине маршрута
      const centerLat = (coords[from].lat + coords[to].lat) / 2;
      const centerLng = (coords[from].lng + coords[to].lng) / 2;
      const center = { lat: centerLat, lng: centerLng };
      console.log("📍 Центр карты:", center);
      setMapCenter(center);
    } else {
      console.warn("❌ Координаты не найдены для:", from, to);
      console.warn("Доступные города:", Object.keys(coords));
    }
  };

  const handleSwap = () => {
    const tempFrom = from;
    const tempTo = to;
    const tempFromInput = fromInput;
    const tempToInput = toInput;

    setFrom(tempTo);
    setTo(tempFrom);
    setFromInput(tempToInput);
    setToInput(tempFromInput);

    // Очистить маршрут и полилинию при смене городов
    setRoute(null);
    setPolylinePath([]);
  };

  const handleShowCityHotels = async (city) => {
    setSelectedCity(city);
    setHotelsLoading(true);
    try {
      const res = await hotelsAPI.getAll({ city });
      const hotelsData = res.data.data?.hotels || [];
      setHotels(hotelsData);
      setShowHotelsModal(true);

      // в debug-режиме
      console.log(
        "[RouteSearch] hotels in",
        city,
        "=>",
        hotelsData.length,
        "items",
      );
    } catch (error) {
      console.error("❌ Ошибка загрузки отелей:", error);
      setHotels([]);
      setShowHotelsModal(true);
    } finally {
      setHotelsLoading(false);
    }
  };

  const handleCloseHotelsModal = () => {
    setShowHotelsModal(false);
    setSelectedCity(null);
    setHotels([]);
  };

  return (
    <div className="route-search-container">
      <div className="search-section">
        <h2>
          <FaRoad style={{ marginRight: "0.5rem" }} /> Поиск маршрута
        </h2>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="form-group autocomplete-group">
            <label>Откуда</label>
            <div className="autocomplete-container">
              <input
                type="text"
                value={fromInput}
                onChange={handleFromInputChange}
                onFocus={() => setFromOpen(true)}
                onBlur={() => setTimeout(() => setFromOpen(false), 200)}
                placeholder="Введите или выберите город..."
                className="city-input"
              />
              {fromOpen && (
                <div className="autocomplete-list">
                  {getFilteredCities(fromInput, to).map((city) => (
                    <div
                      key={city}
                      className="autocomplete-item"
                      onClick={() => handleFromSelect(city)}
                    >
                      {city}
                    </div>
                  ))}
                  {getFilteredCities(fromInput, to).length === 0 && (
                    <div className="autocomplete-item disabled">
                      Города не найдены
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button type="button" className="swap-btn" onClick={handleSwap}>
            <FaArrowsAltV />
          </button>

          <div className="form-group autocomplete-group">
            <label>Куда</label>
            <div className="autocomplete-container">
              <input
                type="text"
                value={toInput}
                onChange={handleToInputChange}
                onFocus={() => setToOpen(true)}
                onBlur={() => setTimeout(() => setToOpen(false), 200)}
                placeholder="Введите или выберите город..."
                className="city-input"
              />
              {toOpen && (
                <div className="autocomplete-list">
                  {getFilteredCities(toInput, from).map((city) => (
                    <div
                      key={city}
                      className="autocomplete-item"
                      onClick={() => handleToSelect(city)}
                    >
                      {city}
                    </div>
                  ))}
                  {getFilteredCities(toInput, from).length === 0 && (
                    <div className="autocomplete-item disabled">
                      Города не найдены
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? (
              <>
                <FaCircleNotch
                  style={{
                    marginRight: "0.5rem",
                    animation: "spin 1s linear infinite",
                  }}
                />
                Поиск...
              </>
            ) : (
              <>
                <FaSearch style={{ marginRight: "0.5rem" }} />
                Найти маршрут
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <FaExclamationCircle style={{ marginRight: "0.5rem" }} />
            {error}
          </div>
        )}
      </div>

      {route && (
        <div className="results-section">
          <div className="route-info">
            <div className="route-header">
              <h3>
                {route.from} → {route.to}
              </h3>
              <span className="distance-badge">📍 {route.distance} км</span>
            </div>

            <div className="route-actions">
              <button
                className="details-btn"
                onClick={() => handleShowCityHotels(route.from)}
              >
                <FaHotel style={{ marginRight: "0.5rem" }} />
                Отели {route.from}
              </button>
              <button
                className="details-btn"
                onClick={() => handleShowCityHotels(route.to)}
              >
                <FaHotel style={{ marginRight: "0.5rem" }} />
                Отели {route.to}
              </button>
            </div>

            <div className="route-details">
              <div className="detail-card">
                <span className="detail-icon">
                  <FaClock />
                </span>
                <span>{route.duration}</span>
              </div>
              <div className="detail-card">
                <span className="detail-icon">
                  <FaRulerHorizontal />
                </span>
                <span>{route.distance} км</span>
              </div>
              <div className="detail-card">
                <span className="detail-icon">
                  <FaInfoCircle />
                </span>
                <span>{route.description}</span>
              </div>
            </div>

            {/* Отладочная информация */}
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "#f0f9ff",
                borderRadius: "8px",
                fontSize: "0.9rem",
                border: "1px solid #e0f2fe",
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#0369a1" }}>
                🔍 Отладка:
              </h4>
              <p style={{ margin: "0.25rem 0" }}>
                📍 Путь:{" "}
                {polylinePath.length > 0
                  ? `${polylinePath.length} точки`
                  : "Не создан"}
              </p>
              <p style={{ margin: "0.25rem 0" }}>
                🗺️ Центр:{" "}
                {mapCenter
                  ? `${mapCenter.lat.toFixed(4)}, ${mapCenter.lng.toFixed(4)}`
                  : "Не установлен"}
              </p>
              <p style={{ margin: "0.25rem 0" }}>
                🏷️ Маркеры: {from && to ? `${from} → ${to}` : "Не установлены"}
              </p>
            </div>

            {route.stops && route.stops.length > 0 && (
              <div className="stops-section">
                <h4>
                  <FaStop style={{ marginRight: "0.5rem" }} /> Остановки по пути
                </h4>
                <div className="stops-list">
                  {route.stops.map((stop, idx) => (
                    <div key={stop.id} className="stop-card">
                      <div className="stop-number">{idx + 1}</div>
                      <div className="stop-content">
                        <h5>{stop.name}</h5>
                        <p className="stop-type">Тип: {stop.type}</p>
                        <p className="stop-distance">
                          ~{stop.distance} км от начала
                        </p>
                      </div>
                      <button
                        className="details-btn"
                        onClick={() => handleShowCityHotels(stop.name)}
                      >
                        Подробнее →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="map-section">
            {apiKey ? (
              <div style={{ position: "relative" }}>
                <LoadScript
                  googleMapsApiKey={apiKey}
                  onLoad={() => console.log("🗺️ Google Maps API загружен")}
                  onError={(error) =>
                    console.error("❌ Ошибка загрузки Google Maps:", error)
                  }
                >
                  <GoogleMap
                    mapContainerStyle={{
                      width: "100%",
                      height: "500px",
                      borderRadius: "12px",
                    }}
                    center={mapCenter}
                    zoom={6}
                    options={{
                      mapTypeId: "roadmap",
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                      zoomControl: true,
                      clickableIcons: false,
                    }}
                    onLoad={(map) => {
                      console.log("🗺️ Карта загружена", map);
                      setMapInstance(map);
                    }}
                    onUnmount={() => {
                      console.log("🗺️ Карта размонтирована");
                      setMapInstance(null);
                    }}
                  >
                    {console.log("🔍 Проверка условий рендеринга:", {
                      polylinePathLength: polylinePath.length,
                      hasRoute: !!route,
                      from,
                      to,
                      polylinePath,
                    })}
                    {polylinePath.length > 0 && route && (
                      <>
                        {console.log(
                          "🎯 Рендеринг маркеров и полилинии:",
                          polylinePath,
                        )}
                        <Marker
                          position={polylinePath[0]}
                          title={from}
                          label={{ text: "A", color: "white" }}
                        />
                        <Marker
                          position={polylinePath[1]}
                          title={to}
                          label={{ text: "B", color: "white" }}
                        />
                        <Polyline
                          key={`${from}-${to}-${Date.now()}`}
                          path={polylinePath}
                          options={{
                            strokeColor: "#DC2626",
                            strokeOpacity: 1.0,
                            strokeWeight: 8,
                            geodesic: true,
                            zIndex: 1000,
                          }}
                        />
                        {console.log("✅ Polyline компонент создан")}
                      </>
                    )}
                  </GoogleMap>
                </LoadScript>
                {polylinePath.length === 0 && route && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: "rgba(255, 255, 255, 0.9)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    🔄 Загрузка маршрута...
                  </div>
                )}
                {polylinePath.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(220, 38, 38, 0.9)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      color: "white",
                      zIndex: 1000,
                    }}
                  >
                    ✅ Маршрут отображен ({polylinePath.length} точек)
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "500px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  textAlign: "center",
                  padding: "2rem",
                }}
              >
                <div>
                  <h3>📍 Google Maps не настроены</h3>
                  <p>Чтобы увидеть карту, добавьте API ключ:</p>
                  <ol
                    style={{
                      textAlign: "left",
                      display: "inline-block",
                      marginTop: "1rem",
                    }}
                  >
                    <li>
                      Откройте{" "}
                      <a
                        href="https://console.cloud.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#FFD700" }}
                      >
                        Google Cloud Console
                      </a>
                    </li>
                    <li>Создайте новый проект</li>
                    <li>Включите Google Maps API</li>
                    <li>Создайте API Key</li>
                    <li>
                      Создайте файл <code>client/.env.local</code>
                    </li>
                    <li>
                      Добавьте:{" "}
                      <code>REACT_APP_GOOGLE_MAPS_API_KEY=ваш_ключ</code>
                    </li>
                    <li>Перезагрузите приложение</li>
                  </ol>
                  <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
                    Маршруты и информация работают без ключа, 🗺️ карта будет
                    активна при настройке
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Модальное окно с отелями */}
      {showHotelsModal && (
        <div className="hotels-modal-overlay" onClick={handleCloseHotelsModal}>
          <div
            className="hotels-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hotels-modal-header">
              <h3>
                <FaHotel style={{ marginRight: "0.75rem" }} />
                Отели города {selectedCity}
              </h3>
              <button className="close-btn" onClick={handleCloseHotelsModal}>
                <FaTimes />
              </button>
            </div>

            <div className="hotels-modal-body">
              {hotelsLoading ? (
                <div className="loading-message">
                  <FaCircleNotch
                    style={{
                      animation: "spin 1s linear infinite",
                      marginRight: "0.5rem",
                    }}
                  />
                  Загрузка отелей...
                </div>
              ) : hotels.length > 0 ? (
                <div className="hotels-list-modal">
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="hotel-item-modal">
                      <div className="hotel-modal-image">
                        <img src={hotel.imageUrl} alt={hotel.name} />
                      </div>
                      <div className="hotel-modal-info">
                        <h4>{hotel.name}</h4>
                        <p className="hotel-description-short">
                          {hotel.description.substring(0, 100)}...
                        </p>
                        <div className="hotel-modal-footer">
                          <div className="rating-block">
                            <FaStar
                              style={{
                                color: "#fbbf24",
                                marginRight: "0.25rem",
                              }}
                            />
                            {hotel.rating.toFixed(1)}
                          </div>
                          <div className="price-block">
                            <FaDollarSign style={{ marginRight: "0.25rem" }} />
                            {hotel.price}/ночь
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-hotels-message">
                  <FaExclamationCircle
                    style={{ marginRight: "0.5rem", fontSize: "2rem" }}
                  />
                  <p>
                    К сожалению, отелей в городе <strong>{selectedCity}</strong>{" "}
                    нет :(
                  </p>
                  <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    Попробуйте поискать в соседних городах
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// client/src/pages/Routes.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { routesAPI } from "../services/api.js";
import { toastSuccess, toastError } from "../utils/toast.js";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";
import {
  FaHotel,
  FaCompass,
  FaStar,
  FaDollarSign,
  FaCar,
} from "react-icons/fa";
import "../styles/Routes.css";

export const Routes = () => {
  const { isAuthenticated } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search route / map planner
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [plan, setPlan] = useState(null);
  const [routePolyline, setRoutePolyline] = useState([]);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 51.1605, lng: 71.4704 });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startLocation: "",
    endLocation: "",
    distance: "",
    duration: "",
    transportType: "car",
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadRoutes();
    }
  }, [isAuthenticated]);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const res = await routesAPI.getUserRoutes(1, 100);
      setRoutes(res.data.data.routes);
    } catch (error) {
      toastError("Ошибка загрузки маршрутов");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await routesAPI.create(formData);
      toastSuccess("Маршрут создан успешно");
      setFormData({
        startLocation: "",
        endLocation: "",
        distance: "",
        duration: "",
        transportType: "car",
      });
      setShowForm(false);
      loadRoutes();
    } catch (error) {
      toastError(error.response?.data?.error || "Ошибка создания маршрута");
    }
  };

  const handleDelete = async (routeId) => {
    if (window.confirm("Вы уверены?")) {
      try {
        await routesAPI.delete(routeId);
        toastSuccess("Маршрут удален");
        loadRoutes();
      } catch (error) {
        toastError("Ошибка удаления маршрута");
      }
    }
  };

  const handleSearchRoute = async (e) => {
    e.preventDefault();
    if (!origin || !destination) {
      toastError("Укажите точки Откуда и Куда");
      return;
    }

    setLoadingPlan(true);
    try {
      const res = await routesAPI.search(origin, destination);
      const planData = res.data.data;
      setPlan(planData);

      if (planData.routeEncoded) {
        const decoded = decodePolyline(planData.routeEncoded);
        setRoutePolyline(decoded);
        setMapCenter(decoded[Math.floor(decoded.length / 2)] || mapCenter);
      } else {
        setRoutePolyline([]);
      }

      if (planData.stops && planData.stops.length > 0) {
        setMapCenter({
          lat: planData.stops[0].lat,
          lng: planData.stops[0].lng,
        });
      }

      toastSuccess("План маршрута загружен");
    } catch (error) {
      toastError(
        error.response?.data?.error ||
          error.message ||
          "Ошибка поиска маршрута",
      );
    } finally {
      setLoadingPlan(false);
    }
  };

  const decodePolyline = (encoded) => {
    if (!encoded) return [];
    let index = 0;
    const coordinates = [];
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let result = 0;
      let shift = 0;
      let b;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      result = 0;
      shift = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      coordinates.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return coordinates;
  };

  if (!isAuthenticated) {
    return (
      <div className="routes-page">
        <div className="auth-required">
          <h2>Пожалуйста, войдите</h2>
          <p>
            Функция создания маршрутов доступна только для зарегистрированных
            пользователей
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="routes-page">
      <div className="page-header">
        <h1>
          <span className="page-title-icon">◇</span> Мои маршруты
        </h1>
      </div>

      <section className="route-planner">
        <h2>Поиск маршрута и остановок</h2>
        <form className="route-search-form" onSubmit={handleSearchRoute}>
          <div className="form-row">
            <div className="form-group">
              <label>Откуда</label>
              <input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Астана"
                required
              />
            </div>
            <div className="form-group">
              <label>Куда</label>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Алматы"
                required
              />
            </div>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loadingPlan}
          >
            {loadingPlan ? "Идет поиск..." : "Найти маршрут"}
          </button>
        </form>

        {plan && (
          <div className="route-summary">
            <h3>
              Маршрут: {plan.from} → {plan.to}
            </h3>
            <p>Расстояние: {(plan.distanceMeters / 1000).toFixed(1)} км</p>
            <p>Время в пути: {(plan.durationSeconds / 3600).toFixed(2)} ч</p>
          </div>
        )}

        <div className="map-wrapper">
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
          >
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={mapCenter}
              zoom={6}
            >
              {routePolyline && routePolyline.length > 0 && (
                <Polyline
                  path={routePolyline}
                  options={{
                    strokeColor: "#1976D2",
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {plan?.destinationRecommendations && (
          <div className="recommendations-section">
            <h3>Рекомендации для {plan.to}</h3>

            {plan.destinationRecommendations.hotels &&
              plan.destinationRecommendations.hotels.length > 0 && (
                <div className="recommendations-category">
                  <h4>
                    <FaHotel style={{ marginRight: "0.5rem" }} /> Отели
                  </h4>
                  <div className="recommendations-grid">
                    {plan.destinationRecommendations.hotels.map((hotel) => (
                      <div key={hotel.id} className="recommendation-card">
                        <h5>{hotel.name}</h5>
                        <p className="city">{hotel.city}</p>
                        <p className="price">
                          <FaDollarSign />
                          {hotel.price
                            ? hotel.price.toLocaleString()
                            : "---"}{" "}
                          тг
                        </p>
                        <p className="rating">
                          <FaStar style={{ marginRight: "0.5rem" }} />{" "}
                          {hotel.rating || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {plan.destinationRecommendations.attractions &&
              plan.destinationRecommendations.attractions.length > 0 && (
                <div className="recommendations-category">
                  <h4>
                    <FaCompass style={{ marginRight: "0.5rem" }} />{" "}
                    Достопримечательности
                  </h4>
                  <div className="recommendations-grid">
                    {plan.destinationRecommendations.attractions.map(
                      (attraction) => (
                        <div
                          key={attraction.id}
                          className="recommendation-card attraction-card"
                        >
                          <h5>{attraction.name}</h5>
                          <p className="type">{attraction.type}</p>
                          <p className="description">
                            {attraction.description}
                          </p>
                          <p className="rating">
                            <FaStar style={{ marginRight: "0.5rem" }} />{" "}
                            {attraction.rating || "—"}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
      </section>

      <div className="page-header">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Отмена" : "+ Создать маршрут"}
        </button>
      </div>

      {showForm && (
        <div className="route-form-container">
          <form onSubmit={handleSubmit} className="route-form">
            <div className="form-row">
              <div className="form-group">
                <label>Точка А (Рход)</label>
                <input
                  type="text"
                  value={formData.startLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, startLocation: e.target.value })
                  }
                  placeholder="Например: Центр Алматы"
                  required
                />
              </div>

              <div className="form-group">
                <label>Точка B (Конец)</label>
                <input
                  type="text"
                  value={formData.endLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, endLocation: e.target.value })
                  }
                  placeholder="Например: Озеро Турмункожай"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Расстояние (км)</label>
                <input
                  type="number"
                  value={formData.distance}
                  onChange={(e) =>
                    setFormData({ ...formData, distance: e.target.value })
                  }
                  placeholder="25"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Время (минуты)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="45"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Вид транспорта</label>
                <select
                  value={formData.transportType}
                  onChange={(e) =>
                    setFormData({ ...formData, transportType: e.target.value })
                  }
                >
                  <option value="car">🚗 Автомобиль</option>
                  <option value="walking">🚶 Пешком</option>
                  <option value="transit">🚌 Транспорт</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Создать маршрут
            </button>
          </form>
        </div>
      )}

      <div className="routes-list">
        {loading ? (
          <p>Загрузка...</p>
        ) : routes.length > 0 ? (
          routes.map((route) => (
            <div key={route.id} className="route-card">
              <div className="route-info">
                <h3>
                  {route.startLocation} → {route.endLocation}
                </h3>
                <p className="route-details">
                  {route.distance} км • {route.duration} мин •{" "}
                  {getTransportEmoji(route.transportType)}
                </p>
              </div>
              <div className="route-actions">
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => handleDelete(route.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-routes">
            <p>😕 У вас еще нет маршрутов</p>
            <p>Создайте свой первый маршрут</p>
          </div>
        )}
      </div>
    </div>
  );
};

function getTransportEmoji(type) {
  const labels = {
    car: "🚗 Автомобиль",
    walking: "🚶 Пешком",
    transit: "🚌 Общественный транспорт",
  };
  return labels[type] || "🚗 Автомобиль";
}

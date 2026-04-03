import React, { useEffect, useState } from "react";
import MapComponent from "../components/Map.jsx";
import { hotelsAPI } from "../services/api.js";
import "./HotelMap.css";

const HotelMap = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      console.log("🟡 Начинаю загрузку отелей...");
      const response = await hotelsAPI.getAll({ page: 1, limit: 100 });

      console.log("✅ Ответ от API:", response);
      console.log("✅ response.data:", response.data);

      // Check different response structures
      let hotelsData = [];

      if (response.data?.hotels) {
        hotelsData = response.data.hotels;
        console.log("✅ Отели из data.hotels:", hotelsData.length);
      } else if (response.data?.success && response.data?.data?.hotels) {
        hotelsData = response.data.data.hotels;
        console.log("✅ Отели из data.data.hotels:", hotelsData.length);
      } else if (response.data?.data?.hotels) {
        hotelsData = response.data.data.hotels;
        console.log(
          "✅ Отели из data.hotels (data wrapper):",
          hotelsData.length,
        );
      } else if (Array.isArray(response.data)) {
        hotelsData = response.data;
        console.log("✅ Отели - это массив:", hotelsData.length);
      } else {
        console.error("❌ Неожиданный формат ответа:", response.data);
      }

      console.log("📍 Отели для отображения:", hotelsData);

      if (hotelsData.length > 0) {
        console.log("✅ Загружено отелей:", hotelsData.length);
        hotelsData.forEach((h) => {
          console.log(
            `  - ${h.name} (${h.city}) coords: ${h.latitude}, ${h.longitude}`,
          );
        });
        setHotels(hotelsData);
      } else {
        console.warn("⚠️ Отели не найдены в ответе");
        setHotels([]);
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки отелей:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    // Uncomment below to navigate to hotel details
    // window.location.href = `/hotels/${hotel.id}`;
  };

  return (
    <div className="hotel-map-page">
      <div className="hotel-map-header">
        <h1>
          <span className="map-title-icon">◇</span> Карта отелей
        </h1>
        <p>Найдите отели на интерактивной карте Казахстана</p>
      </div>

      {/* Debug Info */}
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          margin: "10px",
          borderRadius: "5px",
          fontSize: "12px",
          color: "#333",
        }}
      >
        <strong>DEBUG:</strong> Загрузка: {loading ? "⏳ Да" : "✅ Нет"} |
        Отелей: <strong>{hotels.length}</strong> | Статус:{" "}
        {loading
          ? "загружаю..."
          : hotels.length > 0
            ? "✅ готово"
            : "❌ нет данных"}
      </div>

      {loading ? (
        <div className="loading">⏳ Загрузка карты...</div>
      ) : hotels.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "#fff3cd",
            margin: "20px",
            borderRadius: "8px",
            color: "#856404",
          }}
        >
          <h2>❌ Отели не найдены</h2>
          <p>Проверьте консоль браузера (F12) для логов загрузки</p>
          <p style={{ fontSize: "12px", marginTop: "10px", color: "#666" }}>
            Ожидаемые логи:
            <br />
            🟡 Начинаю загрузку отелей...
            <br />
            ✅ Ответ от API: [данные]
            <br />✅ Загружено отелей: 6
          </p>
        </div>
      ) : (
        <div className="hotel-map-content">
          <MapComponent hotels={hotels} onHotelSelect={handleHotelSelect} />

          {selectedHotel && (
            <div className="hotel-info-panel">
              <h2>{selectedHotel.name}</h2>
              <p className="city">◆ {selectedHotel.city}</p>
              <p className="price">${selectedHotel.price} / ночь</p>
              <p className="rating">★ Рейтинг: {selectedHotel.rating}</p>
              <p className="description">{selectedHotel.description}</p>
            </div>
          )}

          <div className="hotels-legend">
            <h3>Все отели ({hotels.length})</h3>
            <div className="hotels-list">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className={`hotel-item ${
                    selectedHotel?.id === hotel.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedHotel(hotel)}
                >
                  <h4>{hotel.name}</h4>
                  <p className="city">{hotel.city}</p>
                  <p className="price">${hotel.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelMap;

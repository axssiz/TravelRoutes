// client/src/pages/HotelDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hotelsAPI, favoritesAPI } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { LoadingSpinner } from "../components/LoadingSkeletons.jsx";
import MapComponent from "../components/Map.jsx";
import { toastSuccess, toastError } from "../utils/toast.js";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/HotelDetails.css";

export const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    loadHotel();
  }, [id]);

  const loadHotel = async () => {
    try {
      const res = await hotelsAPI.getById(id);
      setHotel(res.data.data);

      // Проверка избранного
      if (isAuthenticated) {
        await checkFavoriteStatus(res.data.data.id);
      }
    } catch (error) {
      toastError("Ошибка загрузки отеля");
      navigate("/hotels");
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async (hotelId) => {
    try {
      const favRes = await favoritesAPI.getAll();
      const favorite = favRes.data.data?.find(
        (fav) => fav.hotel?.id === hotelId,
      );
      if (favorite) {
        setIsFavorite(true);
        setFavoriteId(favorite.id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      console.error("Ошибка проверки избранного:", error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toastError("Пожалуйста, войдите в свой аккаунт");
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        // Удаление из избранного
        await favoritesAPI.remove(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
        toastSuccess("Удалено из избранного");
      } else {
        // Добавление в избранное
        const res = await favoritesAPI.addHotel(hotel.id);
        setIsFavorite(true);
        setFavoriteId(res.data.data.id);
        toastSuccess("Добавлено в избранное");
      }
    } catch (error) {
      toastError(error.response?.data?.error || "Ошибка");
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!hotel) {
    return <div className="error-page">Отель не найден</div>;
  }

  return (
    <div className="hotel-details">
      <button onClick={() => navigate("/hotels")} className="back-btn">
        <span>←</span> Вернуться
      </button>

      <div className="hotel-details-container">
        <div className="hotel-image-section">
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="hotel-main-image"
          />
          <button
            className={`favorite-btn-large ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
          >
            <span className="heart-icon">
              {isFavorite ? <FaHeart color="white" /> : <FaRegHeart />}
            </span>
            <span>{isFavorite ? "В избранном" : "Добавить"}</span>
          </button>
        </div>

        <div className="hotel-info-section">
          <div className="info-header">
            <h1>{hotel.name}</h1>
            <div className="info-badges">
              <span className="city-badge">{hotel.city}</span>
              <span className="rating-badge">
                <span className="star">★</span> {hotel.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="price-section">
            <h2 className="price">${hotel.price}</h2>
            <p className="price-note">за ночь</p>
          </div>

          <div className="description-section">
            <h3>Об отеле</h3>
            <p>{hotel.description}</p>
          </div>

          <div className="features-section">
            <h3>Удобства</h3>
            <ul className="features-list">
              <li>
                <span className="check">✓</span> Бесплатный WiFi
              </li>
              <li>
                <span className="check">✓</span> Бесплатная парковка
              </li>
              <li>
                <span className="check">✓</span> Кондиционер
              </li>
              <li>
                <span className="check">✓</span> Телевизор
              </li>
              <li>
                <span className="check">✓</span> Ванная комната
              </li>
              <li>
                <span className="check">✓</span> Ресторан
              </li>
            </ul>
          </div>

          <div className="contact-section">
            <h3>
              <span className="location-icon">◆</span> Расположение
            </h3>
            <p className="city-info">
              Город: <strong>{hotel.city}</strong>
            </p>
            <p className="rating-info">
              Рейтинг:{" "}
              <strong>
                <span className="star">★</span> {hotel.rating.toFixed(1)}/5
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Карта с расположением отеля */}
      {hotel.latitude && hotel.longitude && (
        <div className="location-section">
          <h3>Расположение на карте</h3>
          <div className="hotel-map-container">
            <MapComponent hotels={[hotel]} />
          </div>
        </div>
      )}

      {/* AI Review Section */}
      <div className="ai-review-section">
        <h3>
          <span className="ai-icon">▲</span> Обзор от ИИ
          <span className="ai-badge">AI Powered</span>
        </h3>
        <div className="ai-review-content">
          {getAIReview(hotel.name, hotel.city)}
        </div>
        {getHotelCharacteristics(hotel.name) && (
          <div className="ai-characteristics">
            {getHotelCharacteristics(hotel.name).map((char, index) => (
              <div key={index} className="characteristic-item">
                <h4>{char.title}</h4>
                <p>{char.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section (Future) */}
      <div className="reviews-section">
        <h3>Отзывы гостей</h3>
        <p className="coming-soon">Функция отзывов будет добавлена позже</p>
      </div>
    </div>
  );
};

// Функция для получения обзора от ИИ по названию отеля
function getAIReview(hotelName, city) {
  const reviews = {
    "Rixos Water World Aktau": `Rixos Water World Aktau 5* — это единственный пятизвездочный курорт в Центральной Азии, работающий по системе «All Inclusive» (все включено), расположенный на Теплом пляже в Актау. Отель предлагает высокий уровень сервиса, частный пляж, тематический парк, аквапарк и семейный отдых с бесплатным проживанием детей. Это идеальное направление для семейного отпуска с максимальным комфортом и разнообразием развлечений.`,
    "Hilton Almaty": `Hilton Almaty - люксовый отель в центре города с панорамным видом на горы. Предлагает высочайший уровень обслуживания, современные удобства и отличное расположение для деловых путешественников и туристов. Отель известен своей гостеприимностью и профессиональным персоналом.`,
    "Rixos Premium Astana": `Rixos Premium Astana предлагает премиум-обслуживание в столице Казахстана. Современный дизайн, высокие стандарты сервиса и удобное расположение делают этот отель идеальным выбором для важных встреч и праздников.`,
  };
  return (
    reviews[hotelName] ||
    `${hotelName} - отличный выбор для проживания в городе ${city}. Отель предлагает комфортные номера, высокий уровень обслуживания и все необходимое для приятного отдыха.`
  );
}

// Функция для получения характеристик отеля
function getHotelCharacteristics(hotelName) {
  const characteristics = {
    "Rixos Water World Aktau": [
      { title: "Концепция", description: "All Inclusive (все включено)" },
      { title: "Расположение", description: "База отдыха Теплый пляж, Актау" },
      {
        title: "Инфраструктура",
        description: "Частный пляж, аквапарк, СПА-центр, рестораны",
      },
      {
        title: "Преимущества",
        description: "Идеален для семей, дети до 12 лет проживают бесплатно",
      },
    ],
    "Hilton Almaty": [
      { title: "Локация", description: "Центр Алматы с видом на горы" },
      { title: "Назначение", description: "Деловой туризм и премиум-отдых" },
      { title: "Услуги", description: "Ресторан, бар, спортзал, СПА" },
      { title: "Уровень", description: "5-звездочный люкс" },
    ],
  };
  return characteristics[hotelName] || null;
}

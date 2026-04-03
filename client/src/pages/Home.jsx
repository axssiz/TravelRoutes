// client/src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHotel,
  FaMap,
  FaUsers,
  FaStar,
  FaPalette,
  FaBolt,
  FaShieldAlt,
  FaMobile,
  FaThumbsUp,
  FaLightbulb,
  FaSearch,
  FaRoute,
  FaPlane,
  FaGlobe,
  FaUmbrellaBeach,
} from "react-icons/fa";
import "../styles/Home.css";

export const Home = () => {
  const [hoveredStat, setHoveredStat] = useState(null);

  return (
    <div className="home">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-new">
        <div className="hero-content-new">
          <div className="hero-badge">▶ Добро пожаловать</div>
          <h1 className="hero-title">
            Планируйте путешествия <span className="gradient-text">легко</span>
          </h1>
          <p className="hero-subtitle">
            Откройте для себя лучшие маршруты и отели по всему Казахстану
          </p>
          <div className="hero-buttons-new">
            <Link to="/hotels" className="btn btn-primary btn-glow">
              <span className="btn-text">
                <FaSearch /> Найти отели
              </span>
            </Link>
            <Link to="/routes" className="btn btn-secondary btn-glow">
              <span className="btn-text">
                <FaRoute /> Построить маршрут
              </span>
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <img
            className="globe-image"
            src="/images/ce1d1860-8823-4382-8456-c1873cfec24e.png"
            alt="World Globe with Landmarks"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div
            className="stat-card"
            onMouseEnter={() => setHoveredStat(0)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className="stat-icon">
              <FaHotel />
            </div>
            <div className="stat-number" data-target="500">
              {hoveredStat === 0 ? "500+" : "500+"}
            </div>
            <div className="stat-label">Отелей</div>
          </div>
          <div
            className="stat-card"
            onMouseEnter={() => setHoveredStat(1)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className="stat-icon">
              <FaMap />
            </div>
            <div className="stat-number">1000+</div>
            <div className="stat-label">Маршрутов</div>
          </div>
          <div
            className="stat-card"
            onMouseEnter={() => setHoveredStat(2)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-number">50K+</div>
            <div className="stat-label">Путешественников</div>
          </div>
          <div
            className="stat-card"
            onMouseEnter={() => setHoveredStat(3)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className="stat-icon">
              <FaStar />
            </div>
            <div className="stat-number">4.9</div>
            <div className="stat-label">Рейтинг</div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="features-enhanced">
        <h2>Почему TravelRoutes?</h2>
        <div className="features-grid">
          <div className="feature-card-enhanced">
            <div className="feature-icon-new">
              <FaPalette />
            </div>
            <h3>Красиво</h3>
            <p>Современный интерфейс со сказочными анимациями</p>
          </div>
          <div className="feature-card-enhanced">
            <div className="feature-icon-new">
              <FaBolt />
            </div>
            <h3>Быстро</h3>
            <p>Мгновенная загрузка и поиск</p>
          </div>
          <div className="feature-card-enhanced">
            <div className="feature-icon-new">
              <FaShieldAlt />
            </div>
            <h3>Безопасно</h3>
            <p>Защита ваших данных и приватность</p>
          </div>
          <div className="feature-card-enhanced">
            <div className="feature-icon-new">
              <FaMobile />
            </div>
            <h3>Адаптивно</h3>
            <p>Работает на любых устройствах</p>
          </div>
          <div className="feature-card-enhanced">
            <div className="feature-icon-new">
              <FaThumbsUp />
            </div>
            <h3>Удобно</h3>
            <p>Все нужное в одном месте</p>
          </div>
          <div className="feature-card-enhanced">
            <div className="feature-icon-new">
              <FaLightbulb />
            </div>
            <h3>Инновационно</h3>
            <p>Новые возможности каждый день</p>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="cta-section-enhanced">
        <div className="cta-content">
          <h2>Готовы начать свое приключение?</h2>
          <p>
            Присоединяйтесь к путешественникам, которые уже открыли Казахстан
          </p>
          <Link to="/register" className="btn btn-cta">
            Начать прямо сейчас
          </Link>
        </div>
        <div className="cta-decoration">
          <div className="floating-emoji">
            <FaPlane />
          </div>
          <div className="floating-emoji">
            <FaGlobe />
          </div>
          <div className="floating-emoji">
            <FaUmbrellaBeach />
          </div>
        </div>
      </section>
    </div>
  );
};

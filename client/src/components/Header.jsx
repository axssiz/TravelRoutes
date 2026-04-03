// client/src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { FaPlane, FaMap, FaCog, FaHardHat } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import "../styles/Header.css";

export const Header = () => {
  const { isAuthenticated, user, logout, isAdmin, isEmployee } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <FaPlane className="logo-icon" /> TravelRoutes
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">
            Главная
          </Link>
          <Link to="/hotels" className="nav-link">
            Отели
          </Link>
          <Link to="/hotel-map" className="nav-link">
            <FaMap className="nav-icon" /> Карта
          </Link>
          <Link to="/search-route" className="nav-link">
            Маршруты
          </Link>
        </nav>

        <div className="auth-menu">
          {isAuthenticated ? (
            <>
              <Link to="/favorites" className="nav-link favorites-link">
                <MdFavoriteBorder className="heart" /> Избранное
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link admin-link">
                  <FaCog /> Админ
                </Link>
              )}
              {isEmployee && (
                <Link to="/employee" className="nav-link employee-link">
                  <FaHardHat /> Работник
                </Link>
              )}
              <Link to="/profile" className="profile-link">
                {user?.name || "Профиль"}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Вход
              </Link>
              <Link to="/register" className="register-btn">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

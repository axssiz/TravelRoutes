// client/src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { authAPI } from "../services/api.js";
import { toastSuccess, toastError } from "../utils/toast.js";
import { FaUser, FaLock } from "react-icons/fa";
import "../styles/Profile.css";

export const Profile = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authAPI.updateProfile({ name, email });
      const updatedUser = res.data.data;
      login(updatedUser, localStorage.getItem("token"));
      toastSuccess("Профиль обновлен");
      setIsEditing(false);
    } catch (error) {
      toastError(error.response?.data?.error || "Ошибка обновления");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>
          <FaUser style={{ marginRight: "0.5rem" }} /> Мой профиль
        </h1>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
            <h2>{user?.name}</h2>
            <p className="role-badge">
              {user?.role === "admin" ? (
                <>
                  <FaLock style={{ marginRight: "0.5rem" }} /> Администратор
                </>
              ) : (
                <>
                  <FaUser style={{ marginRight: "0.5rem" }} /> Пользователь
                </>
              )}
            </p>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Сохранение..." : "Сохранить"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <label>Имя:</label>
                <p>{user?.name}</p>
              </div>

              <div className="info-item">
                <label>Email:</label>
                <p>{user?.email}</p>
              </div>

              <div className="info-item">
                <label>Телефон:</label>
                <p>{user?.phone}</p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Редактировать
              </button>
            </div>
          )}
        </div>

        <div className="profile-stats">
          <h3>Статистика</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">12</div>
              <div className="stat-label">Маршрутов</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">8</div>
              <div className="stat-label">Избранных</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">5</div>
              <div className="stat-label">Бронирований</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import {
  KAZAKHSTAN_CITIES,
  getDistance,
  getDuration,
} from "../constants/cities.js";
import routesService from "../services/routesService.js";
import "../styles/adminRoutes.css";

export const AdminRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    distance: "",
    duration: "",
    description: "",
    stops: [],
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = () => {
    const allRoutes = routesService.getRoutes();
    setRoutes(allRoutes);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCityChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Автозаполнение расстояния и времени
    if (field === "from" || field === "to") {
      if (formData.from && formData.to && formData.from !== value) {
        const fromCity = field === "from" ? value : formData.from;
        const toCity = field === "to" ? value : formData.to;
        const distance = getDistance(fromCity, toCity);
        const duration = getDuration(distance);

        setFormData((prev) => ({
          ...prev,
          distance: distance.toString(),
          duration,
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editId) {
        routesService.updateRoute(editId, formData);
        setSuccess("✅ Маршрут обновлен успешно!");
        setEditId(null);
      } else {
        routesService.addRoute(formData);
        setSuccess("✅ Маршрут добавлен успешно!");
      }

      resetForm();
      loadRoutes();
      setIsOpen(false);
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  const handleEdit = (route) => {
    setEditId(route.id);
    setFormData({
      from: route.from,
      to: route.to,
      distance: route.distance.toString(),
      duration: route.duration,
      description: route.description,
      stops: route.stops || [],
    });
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот маршрут?")) {
      try {
        routesService.deleteRoute(id);
        setSuccess("✅ Маршрут удален успешно!");
        loadRoutes();
      } catch (err) {
        setError(`❌ ${err.message}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      from: "",
      to: "",
      distance: "",
      duration: "",
      description: "",
      stops: [],
    });
    setEditId(null);
    setError("");
    setSuccess("");
  };

  const handleOpenForm = () => {
    resetForm();
    setIsOpen(true);
  };

  return (
    <div className="admin-routes-container">
      <div className="admin-header">
        <h1>⚙️ Админ Панель Маршрутов</h1>
        <button className="btn-primary" onClick={handleOpenForm}>
          ➕ Добавить маршрут
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editId ? "✏️ Редактировать маршрут" : "➕ Новый маршрут"}
              </h2>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="route-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Откуда *</label>
                  <select
                    name="from"
                    value={formData.from}
                    onChange={(e) => handleCityChange("from", e.target.value)}
                    required
                  >
                    <option value="">Выберите город</option>
                    {KAZAKHSTAN_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Куда *</label>
                  <select
                    name="to"
                    value={formData.to}
                    onChange={(e) => handleCityChange("to", e.target.value)}
                    required
                  >
                    <option value="">Выберите город</option>
                    {KAZAKHSTAN_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Расстояние (км) *</label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Время в пути *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="например: 14 часов"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Описание маршрута</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Опишите маршрут..."
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Отмена
                </button>
                <button type="submit" className="btn-success">
                  {editId ? "💾 Сохранить" : "➕ Добавить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="routes-table-section">
        <h2>📊 Список маршрутов ({routes.length})</h2>

        {routes.length === 0 ? (
          <div className="empty-state">
            <p>📭 Маршрутов не найдено</p>
            <p>Добавьте первый маршрут, нажав кнопку выше</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="routes-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Откуда</th>
                  <th>Куда</th>
                  <th>Расстояние</th>
                  <th>Время</th>
                  <th>Остановок</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route, idx) => (
                  <tr key={route.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{route.from}</strong>
                    </td>
                    <td>
                      <strong>{route.to}</strong>
                    </td>
                    <td>{route.distance} км</td>
                    <td>{route.duration}</td>
                    <td>{route.stops?.length || 0}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(route)}
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(route.id)}
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

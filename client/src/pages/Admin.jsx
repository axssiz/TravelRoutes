// client/src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import { hotelsAPI, routesAPI, adminAPI } from "../services/api.js";
import { toastSuccess, toastError } from "../utils/toast";
import { StarRating } from "../components/StarRating.jsx";
import {
  FaCog,
  FaHotel,
  FaRoad,
  FaStar,
  FaDollarSign,
  FaMap,
  FaSearch,
} from "react-icons/fa";
import "../styles/Admin.css";

export const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hotels, setHotels] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [hotelForm, setHotelForm] = useState({
    name: "",
    description: "",
    price: "",
    rating: "",
    city: "",
    imageFile: null,
  });
  const [isDragOver, setIsDragOver] = useState(false);

  // Новые состояния для улучшений
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalRoutes: 0,
    avgRating: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadStats();
    if (activeTab === "hotels") {
      loadHotels();
    } else if (activeTab === "routes") {
      loadRoutes();
    } else if (activeTab === "users") {
      loadUsers();
    }
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const [hotelsRes, routesRes] = await Promise.all([
        hotelsAPI.getAll({ limit: 1000 }),
        routesAPI.getAllRoutes(1, 1000),
      ]);

      const hotelsData = hotelsRes.data.data.hotels;
      const routesData = routesRes.data.data.routes;

      const totalRevenue = hotelsData.reduce(
        (sum, hotel) => sum + parseFloat(hotel.price || 0),
        0,
      );
      const avgRating =
        hotelsData.length > 0
          ? hotelsData.reduce(
              (sum, hotel) => sum + parseFloat(hotel.rating || 0),
              0,
            ) / hotelsData.length
          : 0;

      setStats({
        totalHotels: hotelsData.length,
        totalRoutes: routesData.length,
        avgRating: avgRating.toFixed(1),
        totalRevenue: totalRevenue.toFixed(2),
      });
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    }
  };

  const loadHotels = async () => {
    setLoading(true);
    try {
      const res = await hotelsAPI.getAll({ limit: 100 });
      setHotels(res.data.data.hotels);
    } catch (error) {
      toastError("Ошибка загрузки отелей");
    } finally {
      setLoading(false);
    }
  };

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const res = await routesAPI.getAllRoutes(1, 100);
      setRoutes(res.data.data.routes);
    } catch (error) {
      toastError("Ошибка загрузки маршрутов");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllUsers();
      setUsers(res.data.data);
    } catch (error) {
      toastError("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  // Фильтрация и поиск
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !cityFilter || hotel.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Получение уникальных городов для фильтра
  const uniqueCities = [...new Set(hotels.map((hotel) => hotel.city))].sort();

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", hotelForm.name);
      formData.append("description", hotelForm.description);
      formData.append("price", hotelForm.price);
      formData.append("rating", hotelForm.rating || "");
      formData.append("city", hotelForm.city);
      if (hotelForm.imageFile) {
        formData.append("image", hotelForm.imageFile);
      }

      await hotelsAPI.create(formData);
      toastSuccess("Отель создан");
      setHotelForm({
        name: "",
        description: "",
        price: "",
        rating: "",
        city: "",
        imageFile: null,
      });
      setShowHotelForm(false);
      loadHotels();
    } catch (error) {
      toastError(error.response?.data?.error || "Ошибка создания отеля");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      setHotelForm({ ...hotelForm, imageFile: files[0] });
    }
  };

  const handleRatingChange = (rating) => {
    setHotelForm({ ...hotelForm, rating: rating });
  };

  const handleDeleteHotel = async (id) => {
    if (window.confirm("Удалить этот отель?")) {
      try {
        await hotelsAPI.delete(id);
        toastSuccess("Отель удален");
        loadHotels();
      } catch (error) {
        toastError("Ошибка удаления отеля");
      }
    }
  };

  // Обрабатывает изменение роли пользователя в админском интерфейсе.
  //  - userId: id выбранного пользователя
  //  - newRole: одно из значений USER, EMPLOYEE, ADMIN
  // После обновления перезагружаем список, чтобы UI сразу отобразил обновлённую роль.
  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      toastSuccess("Роль пользователя изменена");
      loadUsers();
    } catch (error) {
      toastError("Ошибка изменения роли");
    }
  };

  // Удаляет указанного пользователя, с подтверждением и перезагрузкой списка.
  // Защита от попытки удаления своей собственной учётной записи реализована на сервере.
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Удалить этого пользователя?")) {
      try {
        await adminAPI.deleteUser(userId);
        toastSuccess("Пользователь удален");
        loadUsers();
      } catch (error) {
        toastError("Ошибка удаления пользователя");
      }
    }
  };

  const handleDeleteRoute = async (routeId) => {
    if (window.confirm("Удалить этот маршрут?")) {
      try {
        await routesAPI.delete(routeId);
        toastSuccess("Маршрут удален");
        loadRoutes();
      } catch (error) {
        toastError("Ошибка удаления маршрута");
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>
          <span className="admin-icon">
            <FaCog />
          </span>{" "}
          Админ панель
        </h1>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <span className="tab-icon">📊</span> Дашборд
        </button>
        <button
          className={`tab-btn ${activeTab === "hotels" ? "active" : ""}`}
          onClick={() => setActiveTab("hotels")}
        >
          <span className="tab-icon">⌂</span> Отели
        </button>
        <button
          className={`tab-btn ${activeTab === "routes" ? "active" : ""}`}
          onClick={() => setActiveTab("routes")}
        >
          <span className="tab-icon">◇</span> Маршруты
        </button>
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <span className="tab-icon">👥</span> Контрагенты
        </button>
      </div>

      <div className="admin-content">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="dashboard">
            <h2>Статистика системы</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaHotel />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalHotels}</h3>
                  <p>Всего отелей</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaRoad />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalRoutes}</h3>
                  <p>Всего маршрутов</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaStar />
                </div>
                <div className="stat-content">
                  <h3>{stats.avgRating}</h3>
                  <p>Средний рейтинг</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaDollarSign />
                </div>
                <div className="stat-content">
                  <h3>${stats.totalRevenue}</h3>
                  <p>Общая стоимость</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Быстрые действия</h3>
              <div className="actions-grid">
                <button
                  className="action-btn"
                  onClick={() => setActiveTab("hotels")}
                >
                  <span className="action-icon">➕</span>
                  <span>Добавить отель</span>
                </button>
                <button
                  className="action-btn"
                  onClick={() => setActiveTab("routes")}
                >
                  <span className="action-icon">🛤️</span>
                  <span>Управление маршрутами</span>
                </button>
                <button
                  className="action-btn"
                  onClick={() => window.open("/hotel-map", "_blank")}
                >
                  <span className="action-icon">
                    <FaMap />
                  </span>
                  <span>Посмотреть карту</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hotels Tab */}
        {activeTab === "hotels" && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Управление отелями</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowHotelForm(!showHotelForm)}
              >
                {showHotelForm ? "Отмена" : "+ Добавить отель"}
              </button>
            </div>

            {/* Поиск и фильтры */}
            <div className="filters-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Поиск по названию или городу..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">
                  <FaSearch />
                </span>
              </div>
              <div className="filter-select">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                >
                  <option value="">Все города</option>
                  {uniqueCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="results-count">
                Найдено: {filteredHotels.length} отел
                {filteredHotels.length !== 1 ? "ей" : "ь"}
              </div>
            </div>

            {showHotelForm && (
              <form onSubmit={handleCreateHotel} className="admin-form">
                <div className="form-group">
                  <label>Название отеля *</label>
                  <input
                    type="text"
                    value={hotelForm.name}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Город *</label>
                  <input
                    type="text"
                    value={hotelForm.city}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, city: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Описание *</label>
                  <textarea
                    value={hotelForm.description}
                    onChange={(e) =>
                      setHotelForm({
                        ...hotelForm,
                        description: e.target.value,
                      })
                    }
                    required
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Цена, $ *</label>
                    <input
                      type="number"
                      value={hotelForm.price}
                      onChange={(e) =>
                        setHotelForm({ ...hotelForm, price: e.target.value })
                      }
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Рейтинг</label>
                    <StarRating
                      rating={parseFloat(hotelForm.rating) || 0}
                      onRatingChange={handleRatingChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Изображение</label>
                  <div
                    className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setHotelForm({
                          ...hotelForm,
                          imageFile: e.target.files[0],
                        })
                      }
                      style={{ display: "none" }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="drop-zone-label">
                      {hotelForm.imageFile ? (
                        <span>Файл выбран: {hotelForm.imageFile.name}</span>
                      ) : (
                        <span>
                          Перетащите изображение сюда или нажмите для выбора
                        </span>
                      )}
                    </label>
                  </div>
                  {hotelForm.imageFile && (
                    <div className="image-preview">
                      <img
                        src={URL.createObjectURL(hotelForm.imageFile)}
                        alt="Preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Создать отель
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Город</th>
                      <th>Цена</th>
                      <th>Рейтинг</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedHotels.map((hotel) => (
                      <tr key={hotel.id}>
                        <td>{hotel.name}</td>
                        <td>{hotel.city}</td>
                        <td>${hotel.price}</td>
                        <td>★ {hotel.rating}</td>
                        <td>
                          <button
                            className="btn btn-small btn-primary"
                            onClick={() =>
                              (window.location.href = `/hotels/${hotel.id}`)
                            }
                          >
                            Просмотр
                          </button>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => handleDeleteHotel(hotel.id)}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Пагинация */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      ‹ Предыдущая
                    </button>

                    <div className="pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            className={`pagination-btn ${page === currentPage ? "active" : ""}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Следующая ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Routes Tab */}
        {activeTab === "routes" && (
          <div className="admin-section">
            <h2>Управление маршрутами</h2>

            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>От</th>
                    <th>До</th>
                    <th>Расстояние</th>
                    <th>Время</th>
                    <th>Пользователь</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route) => (
                    <tr key={route.id}>
                      <td>{route.startLocation}</td>
                      <td>{route.endLocation}</td>
                      <td>{route.distance} км</td>
                      <td>{route.duration} мин</td>
                      <td>{route.user?.name}</td>
                      <td>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => handleDeleteRoute(route.id)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="admin-section">
            <h2>Управление пользователями</h2>

            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Имя</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Дата регистрации</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className="role-select"
                        >
                          <option value="user">Пользователь</option>
                          <option value="employee">Сотрудник</option>
                          <option value="admin">Администратор</option>
                        </select>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Обновите server/src/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Импорт роутов
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const routeRoutes = require('./routes/routeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API роуты
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);

// 404 обработчик
app.use((req, res) => {
res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
console.log(`🗂️  Окружение: ${process.env.NODE_ENV || 'development'}`);
console.log(`📚 API документация: http://localhost:${PORT}/api/health`);
});

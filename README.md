# TravelRoutes - Система поиска туристических маршрутов и отелей

Полнофункциональное веб-приложение для поиска и резервирования туристических маршрутов и отелей по всему Казахстану.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Особенности

- 🏨 **Поиск отелей** - Большой каталог отелей с фильтрацией по городу, цене и рейтингу
- 🗺️ **Создание маршрутов** - Постройте свои маршруты путешествия
- ❤️ **Избранное** - Сохраняйте интересующие вас отели и маршруты
- 🔐 **Безопасная аутентификация** - JWT токены и хеширование паролей
- 📱 **Мобильный дизайн** - Полная адаптивность для всех устройств
- 👤 **Профиль пользователя** - Управление личной информацией
- 🔧 **Админ панель** - Управление отелями и маршрутами
- 📊 **OTP авторизация** - Вход через SMS код

## 📋 Стек технологий

### Frontend

- **React 18** - Фреймворк UI
- **React Router 6** - Маршрутизация
- **Axios** - HTTP клиент
- **CSS3** - Стилизация

### Backend

- **Node.js + Express** - Сервер приложения
- **PostgreSQL** - База данных
- **Prisma ORM** - Работа с БД
- **JWT** - Аутентификация
- **bcrypt** - Хеширование паролей

## 🚀 Быстрый старт

### Требования

- Node.js 16+
- PostgreSQL 12+
- npm или yarn

### Установка

#### 1. Клонируйте репозиторий

\`\`\`bash
git clone https://github.com/yourusername/travel-routes.git
cd travel-routes
\`\`\`

#### 2. Настройка Backend

\`\`\`bash
cd server

# Установка зависимостей

npm install

# Создание переменных окружения

cp .env.example .env

# Отредактируйте .env с вашими данными БД

# DATABASE_URL=postgresql://user:password@localhost:5432/travel_routes_db

# Запуск миграций

npm run prisma:migrate

# Заполнение БД начальными данными

npm run prisma:seed

# Запуск сервера

npm run dev
\`\`\`

Сервер запустится на `http://localhost:5000`

#### 3. Настройка Frontend

\`\`\`bash
cd client

# Установка зависимостей

npm install

# Запуск приложения

npm start
\`\`\`

Приложение откроется на `http://localhost:3000`

## 📚 API Документация

### Аутентификация

#### Регистрация

\`\`\`bash
POST /api/auth/register
Content-Type: application/json

{
"name": "Иван Петров",
"email": "ivan@example.com",
"phone": "+77001234567",
"password": "password123"
}
\`\`\`

#### Вход

\`\`\`bash
POST /api/auth/login
Content-Type: application/json

{
"email": "ivan@example.com",
"password": "password123"
}
\`\`\`

#### Получить профиль (требует токен)

\`\`\`bash
GET /api/auth/profile
Authorization: Bearer YOUR_TOKEN
\`\`\`

### Отели

#### Получить все отели

\`\`\`bash
GET /api/hotels?city=Almaty&minPrice=100&maxPrice=500
\`\`\`

#### Получить отель по ID

\`\`\`bash
GET /api/hotels/1
\`\`\`

#### Создать отель (только админ)

\`\`\`bash
POST /api/hotels
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
"name": "Hilton Almaty",
"description": "Люксовый отель...",
"price": 350,
"rating": 4.8,
"city": "Almaty",
"imageUrl": "https://..."
}
\`\`\`

### Маршруты

#### Создать маршрут (требует токен)

\`\`\`bash
POST /api/routes
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
"startLocation": "Центр Алматы",
"endLocation": "Озеро Турмункожай",
"distance": 25,
"duration": 45,
"transportType": "car"
}
\`\`\`

#### Получить мои маршруты (требует токен)

\`\`\`bash
GET /api/routes/my-routes
Authorization: Bearer YOUR_TOKEN
\`\`\`

### Избранное

#### Получить избранное (требует токен)

\`\`\`bash
GET /api/favorites
Authorization: Bearer YOUR_TOKEN
\`\`\`

#### Добавить отель в избранное (требует токен)

\`\`\`bash
POST /api/favorites/hotel
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
"hotelId": 1
}
\`\`\`

## 🗄️ Структура БД

### Таблицы

**users**

- id (PK)
- name
- email (UNIQUE)
- phone (UNIQUE)
- password
- role ('user' | 'admin')
- createdAt
- updatedAt

**hotels**

- id (PK)
- name
- description
- price
- rating
- city
- imageUrl
- createdAt
- updatedAt

**routes**

- id (PK)
- startLocation
- endLocation
- distance
- duration
- transportType
- userId (FK)
- createdAt
- updatedAt

**favorites**

- id (PK)
- userId (FK)
- hotelId (FK, nullable)
- routeId (FK, nullable)
- createdAt

## 🎓 Учетные данные для тестирования

### Администратор

- Email: `admin@travel.com`
- Пароль: `admin123`

### Пользователь

- Email: `ivan@example.com`
- Пароль: `password123`

- Email: `maria@example.com`
- Пароль: `password123`

## 📁 Структура проекта

```
travel-routes/
├── client/                 # React приложение
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── server/                 # Node.js + Express сервер
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

## 🌐 Развертывание

### Frontend (Vercel)

\`\`\`bash

# Установите Vercel CLI

npm i -g vercel

# Развертните приложение

cd client
vercel
\`\`\`

### Backend (Heroku)

\`\`\`bash

# Установите Heroku CLI

npm i -g heroku

# Логин в Heroku

heroku login

# Создание приложения

heroku create your-app-name

# Установка переменных окружения

heroku config:set DATABASE_URL=postgresql://...
heroku config:set JWT_SECRET=your_secret

# Развертывание

git push heroku main
\`\`\`

## 🐛 Решение проблем

### Ошибка подключения к БД

Убедитесь, что PostgreSQL запущен и строка подключения верна в `.env`

### CORS ошибки

Проверьте, что backend запущен на `http://localhost:5000`

### Проблема с Prisma

\`\`\`bash
cd server
npx prisma migrate reset
npx prisma db push
npm run prisma:seed
\`\`\`

## 📝 TODO

- [ ] Интеграция Google Maps API
- [ ] Система отзывов
- [ ] Система рейтинга
- [ ] Email подтверждение
- [ ] Интеграция платежей (Stripe)
- [ ] Push уведомления
- [ ] Многоязычность

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. Подробнее см. [LICENSE](LICENSE)

## 👥 Контрибьютинг

Приветствуются pull requests. Для больших изменений сначала откройте issue для обсуждения.

## 📞 Контакты

- Email: support@travelroutes.kz
- Телефон: +7 (700) 123-45-67
- Telegram: [@travelroutes](https://t.me/travelroutes)

## 🙏 Спасибо

Спасибо всем, кто способствует развитию этого проекта!

---

**Версия:** 1.0.0  
**Последнее обновление:** 30 марта 2024 г.
#   T r a v e l R o u t e s  
 
# Server Backend - Travel Routes API

## 📋 Структура

```
server/
├── src/
│   ├── controllers/     # Контроллеры для обработки запросов
│   ├── routes/         # Определение маршрутов API
│   ├── middleware/     # Middleware (auth, error handler)
│   ├── services/       # Бизнес-логика
│   ├── utils/          # Утилиты (JWT, validators, SMS)
│   └── index.js        # Точка входа сервера
├── prisma/
│   ├── schema.prisma   # Описание БД
│   └── seed.js         # Начальные данные
├── .env                # Переменные окружения
├── .env.example        # Пример переменных окружения
└── package.json        # Зависимости
```

## 🚀 Запуск

### 1. Установка зависимостей

\`\`\`bash
cd server
npm install
\`\`\`

### 2. Настройка БД

Создайте файл `.env` и подставьте ваше подключение к PostgreSQL.

### 3. Миграции

\`\`\`bash
npm run prisma:migrate
\`\`\`

### 4. Заполнение данными

\`\`\`bash
npm run prisma:seed
\`\`\`

### 5. Запуск сервера

**Разработка (с автоперезагрузкой):**

\`\`\`bash
npm run dev
\`\`\`

**Production:**

\`\`\`bash
npm start
\`\`\`

Сервер будет доступен на `http://localhost:5000`

## 📚 API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/send-otp` - Отправка OTP
- `POST /api/auth/login-otp` - Вход по OTP
- `GET /api/auth/profile` - Получить профиль (требует токен)
- `PUT /api/auth/profile` - Обновить профиль (требует токен)

### Отели

- `GET /api/hotels` - Получить все отели с фильтрами
- `GET /api/hotels/cities` - Получить список городов
- `GET /api/hotels/:id` - Получить отель по ID
- `POST /api/hotels` - Создать отель (только админ)
- `PUT /api/hotels/:id` - Обновить отель (только админ)
- `DELETE /api/hotels/:id` - Удалить отель (только админ)

### Маршруты

- `GET /api/routes/my-routes` - Получить маршруты пользователя (требует токен)
- `POST /api/routes` - Создать маршрут (требует токен)
- `GET /api/routes/:id` - Получить маршрут по ID (требует токен)
- `PUT /api/routes/:id` - Обновить маршрут (требует токен)
- `DELETE /api/routes/:id` - Удалить маршрут (требует токен)
- `GET /api/routes/admin/all-routes` - Получить все маршруты (только админ)

### Избранное

- `GET /api/favorites` - Получить все избранные (требует токен)
- `GET /api/favorites/check` - Проверить, в избранном ли (требует токен)
- `POST /api/favorites/hotel` - Добавить отель в избранное (требует токен)
- `POST /api/favorites/route` - Добавить маршрут в избранное (требует токен)
- `DELETE /api/favorites/:id` - Удалить из избранного (требует токен)

## 🔐 Аутентификация

Все защищенные роуты требуют JWT токена в заголовке:

\`\`\`
Authorization: Bearer YOUR_TOKEN_HERE
\`\`\`

## 📝 Пример запросов

### Регистрация

\`\`\`bash
curl -X POST http://localhost:5000/api/auth/register \\
-H "Content-Type: application/json" \\
-d '{
"name": "Иван",
"email": "ivan@example.com",
"phone": "+77001234567",
"password": "password123"
}'
\`\`\`

### Вход

\`\`\`bash
curl -X POST http://localhost:5000/api/auth/login \\
-H "Content-Type: application/json" \\
-d '{
"email": "ivan@example.com",
"password": "password123"
}'
\`\`\`

### Получить отели со фильтром

\`\`\`bash
curl http://localhost:5000/api/hotels?city=Almaty&minPrice=100&maxPrice=500
\`\`\`

### Создать маршрут (требует токен)

\`\`\`bash
curl -X POST http://localhost:5000/api/routes \\
-H "Authorization: Bearer YOUR_TOKEN" \\
-H "Content-Type: application/json" \\
-d '{
"startLocation": "Центр Алматы",
"endLocation": "Озеро Турмункожай",
"distance": 25,
"duration": 45,
"transportType": "car"
}'
\`\`\`

## 🗄️ Переменные окружения

Смотрите `.env.example` для полного списка. Основные:

```
DATABASE_URL=postgresql://user:password@localhost:5432/travel_routes_db
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

## 🧪 Тестирование

Используйте Postman или cURL для тестирования API.

Учетные данные администратора (после seed):

- Email: `admin@travel.com`
- Пароль: `admin123`

Обычного пользователя:

- Email: `ivan@example.com`
- Пароль: `password123`

# Client Frontend - TravelRoutes React App

## 📋 Структура

```
client/
├── public/
│   └── index.html
├── src/
│   ├── pages/              # Страницы приложения
│   ├── components/         # Переиспользуемые компоненты
│   ├── context/            # React Context (Auth)
│   ├── hooks/              # Custom React Hooks
│   ├── services/           # API сервисы
│   ├── styles/             # CSS файлы
│   ├── utils/              # Утилиты
│   ├── App.jsx             # Основной компонент
│   └── index.js            # Точка входа
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Установка и запуск

### 1. Установка зависимостей

\`\`\`bash
cd client
npm install
\`\`\`

### 2. Запуск в режиме разработки

\`\`\`bash
npm start

```

Браузер откроется на [http://localhost:3000](http://localhost:3000)

### 3. Сборка для production

\`\`\`bash
npm run build
\`\`\`

## 📱 Страницы

- **Главная** (/) - Информация о сервисе
- **Вход** (/login) - Аутентификация
- **Регистрация** (/register) - Создание аккаунта
- **Отели** (/hotels) - Список отелей с фильтрами
- **Детали отеля** (/hotels/:id) - Полная информация об отеле
- **Маршруты** (/routes) - Создание и управление маршрутами
- **Профиль** (/profile) - Профиль пользователя
- **Избранное** (/favorites) - Сохраненные отели и маршруты
- **Админ панель** (/admin) - управление отелями и маршрутами (только для админов)

## 🎨 Дизайн

- Современный градиентный дизайн
- Glassmorphism эффекты
- Плавные анимации и переходы
- Полная адаптивность для мобильных устройств
- Интуитивный UX

## 🔐 Аутентификация

- Email/пароль вход
- Вход по OTP (через SMS)
- JWT токены
- Роли: пользователь, администратор

## 🛠️ Технологии

- React 18 с Hooks
- React Router 6
- Axios для API запросов
- CSS3 с переменными
- Context API для управления состоянием

## 📔 Компоненты

### Header
Заголовок сайта с навигацией и аутентификацией

### Footer
Подвал с контактной информацией и ссылками

### HotelCard
Карточка отеля с изображением, ценой и рейтингом

### Toast
Система уведомлений

### LoadingSkeletons
Скелетон загрузки для улучшения UX

### ProtectedRoute
Защита роутов, требующих аутентификации

## 📚 Примеры использования

### Использование API

\`\`\`javascript
import { hotelsAPI } from './services/api';

// Получить отели с фильтром
const res = await hotelsAPI.getAll({
  city: 'Almaty',
  minPrice: 100,
  maxPrice: 500
});
\`\`\`

### Использование Toast

\`\`\`javascript
import { toastSuccess, toastError } from './utils/toast';

toastSuccess('Успешно!');
toastError('Произошла ошибка');
\`\`\`

### Использование Auth Context

\`\`\`javascript
import { useAuth } from './hooks/useAuth';

const { user, isAuthenticated, logout } = useAuth();
\`\`\`

## 🌍 Переменные окружения

Создайте файл `.env` в папке `client`:

\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

## 🧪 Тестирование

Учетные данные администратора:
- Email: \`admin@travel.com\`
- Пароль: \`admin123\`

Обычного пользователя:
- Email: \`ivan@example.com\`
- Пароль: \`password123\`

## 📞 Поддержка

Контакты для связи включены в подвале приложения.
```

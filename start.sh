#!/bin/bash
# Quick start script для TravelRoutes

echo "🚀 Запуск TravelRoutes..."

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Пожалуйста, установите Node.js 16+"
    exit 1
fi

echo "✅ Node.js версия: $(node -v)"

# Запуск Backend
echo ""
echo "🔌 Запуск Backend сервера..."
cd server

if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей server..."
    npm install
fi

# Проверка .env файла
if [ ! -f ".env" ]; then
    echo "⚠️  Копирование .env.example в .env"
    cp .env.example .env
    echo "ℹ️  Пожалуйста, отредактируйте .env с вашими данными БД"
fi

npm run dev &
SERVER_PID=$!

cd ..

# Чуть подождать для полной инициализации сервера
sleep 3

# Запуск Frontend
echo ""
echo "⚛️  Запуск Frontend приложения..."
cd client

if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей client..."
    npm install
fi

npm start &
CLIENT_PID=$!

cd ..

echo ""
echo "✨ Приложение запущено!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend:  http://localhost:5000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Нажмите Ctrl+C для остановки приложения"

# Ожидание завершения процессов
wait

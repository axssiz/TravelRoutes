@echo off
REM Quick start script for TravelRoutes (Windows)

echo.
echo 🚀 Запуск TravelRoutes...
echo.

REM Check Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не установлен. Пожалуйста, установите Node.js 16+
    pause
    exit /b 1
)

echo ✅ Node.js установлен

REM Start Backend
echo.
echo 🔌 Запуск Backend сервера...
cd server

if not exist "node_modules" (
    echo 📦 Установка зависимостей server...
    call npm install
)

if not exist ".env" (
    echo ⚠️  Копирование .env.example в .env
    copy .env.example .env
    echo ℹ️  Пожалуйста, отредактируйте .env с вашими данными БД
)

start "Backend Server" cmd /k npm run dev
cd ..

timeout /t 3 /nobreak

REM Start Frontend
echo.
echo ⚛️  Запуск Frontend приложения...
cd client

if not exist "node_modules" (
    echo 📦 Установка зависимостей client...
    call npm install
)

start "Frontend App" cmd /k npm start
cd ..

echo.
echo ✨ Приложение запущено!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🌐 Frontend: http://localhost:3000
echo 🔗 Backend:  http://localhost:5000
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 💡 Закройте окна терминала для остановки
echo.

pause

// test-employee-button.js
const axios = require("axios");

async function testEmployeeButton() {
  try {
    console.log("🔍 Тестирование отображения кнопки работника...\n");

    // 1. Вход работника
    console.log("1. Выполняем вход работника...");
    const loginResponse = await axios.post(
      "http://localhost:8080/api/auth/login",
      {
        email: "worker2@example.com",
        password: "worker123",
      },
    );

    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;

    console.log("✅ Вход успешен!");
    console.log("👤 Пользователь:", user.name);
    console.log("🎭 Роль из API:", user.role);

    // 2. Проверяем логику отображения кнопки (как в AuthContext)
    const isEmployee = user.role?.toLowerCase() === "employee";
    console.log("🔍 isEmployee (после исправления):", isEmployee);

    if (isEmployee) {
      console.log('✅ Кнопка "Работник" должна отображаться в навигации');
      console.log("📍 Проверьте браузер: http://localhost:3000");
      console.log('🔗 Должна быть ссылка "Работник" с иконкой рабочего');
    } else {
      console.log('❌ Кнопка "Работник" не будет отображаться');
      console.log("🔍 Роль пользователя:", user.role);
    }
  } catch (error) {
    console.log("❌ Ошибка:", error.response?.data?.error || error.message);
  }
}

testEmployeeButton();

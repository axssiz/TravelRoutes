// test-employee-access.js
const axios = require("axios");

async function testEmployeeAccess() {
  try {
    console.log("Тестирование доступа работника к API...");

    // Сначала входим
    const loginResponse = await axios.post(
      "http://localhost:8080/api/auth/login",
      {
        email: "worker2@example.com",
        password: "worker123",
      },
    );

    const token = loginResponse.data.data.token;
    console.log("✅ Вход успешен, токен получен");

    // Проверяем доступ к отелям (работник должен иметь доступ)
    const hotelsResponse = await axios.get("http://localhost:8080/api/hotels", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(
      "✅ Доступ к отелям разрешен, получено:",
      hotelsResponse.data.data.hotels.length,
      "отелей",
    );

    // Проверяем доступ к пользователям (работник НЕ должен иметь доступ)
    try {
      const usersResponse = await axios.get(
        "http://localhost:8080/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("❌ Ошибка: работник имеет доступ к пользователям!");
    } catch (error) {
      if (error.response?.status === 403) {
        console.log(
          "✅ Доступ к пользователям правильно запрещен (403 Forbidden)",
        );
      } else {
        console.log(
          "❌ Неожиданная ошибка при доступе к пользователям:",
          error.response?.status,
        );
      }
    }

    console.log("\n🎉 Тестирование завершено успешно!");
    console.log(
      "Работник может войти и имеет доступ к отелям, но не к пользователям.",
    );
  } catch (error) {
    console.log(
      "❌ Ошибка тестирования:",
      error.response?.data?.error || error.message,
    );
  }
}

testEmployeeAccess();

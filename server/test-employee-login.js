// test-employee-login.js
const axios = require("axios");

async function testEmployeeLogin() {
  try {
    console.log("Тестирование входа работника...");

    const response = await axios.post("http://localhost:8080/api/auth/login", {
      email: "Postavtye100@please.com",
      password: "password123", // Попробуем этот пароль
    });

    console.log("Успешный вход!");
    console.log("Токен:", response.data.token ? "Получен" : "Не получен");
    console.log("Пользователь:", response.data.user.name);
    console.log("Роль:", response.data.user.role);
  } catch (error) {
    console.log("Ошибка входа:", error.response?.data?.error || error.message);
    console.log("Попробуем другие пароли...");

    // Попробуем employee123
    try {
      const response2 = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: "Postavtye100@please.com",
          password: "employee123",
        },
      );
      console.log("Успешный вход с employee123!");
      console.log("Пользователь:", response2.data.user.name);
      console.log("Роль:", response2.data.user.role);
    } catch (error2) {
      console.log("employee123 тоже не подошел");
    }
  }
}

testEmployeeLogin();

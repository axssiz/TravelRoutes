// test-new-employee-login.js
const axios = require("axios");

async function testNewEmployeeLogin() {
  try {
    console.log("Тестирование входа нового работника...");

    const response = await axios.post("http://localhost:8080/api/auth/login", {
      email: "worker2@example.com",
      password: "worker123",
    });

    console.log("✅ Успешный вход!");
    console.log("Полный ответ:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log(
      "❌ Ошибка входа:",
      error.response?.data?.error || error.message,
    );
    if (error.response?.data) {
      console.log(
        "Данные ответа:",
        JSON.stringify(error.response.data, null, 2),
      );
    }
  }
}

testNewEmployeeLogin();

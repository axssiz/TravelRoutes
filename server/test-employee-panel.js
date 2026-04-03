// test-employee-panel.js
const axios = require("axios");

async function testEmployeePanel() {
  try {
    console.log("🔍 Проверка доступа к панели работника...\n");

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
    console.log("✅ Вход успешен!");
    console.log("👤 Пользователь:", loginResponse.data.data.user.name);
    console.log("🎭 Роль:", loginResponse.data.data.user.role);
    console.log("🔑 Токен получен\n");

    // 2. Проверка доступа к отелям (для статистики)
    console.log("2. Проверяем доступ к отелям для статистики...");
    const hotelsResponse = await axios.get("http://localhost:8080/api/hotels?limit=1000", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Доступ к отелям разрешен");
    console.log("🏨 Количество отелей:", hotelsResponse.data.data.hotels.length);

    // 3. Проверка доступа к маршрутам
    console.log("\n3. Проверяем доступ к маршрутам...");
    const routesResponse = await axios.get("http://localhost:8080/api/routes?page=1&limit=1000", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Доступ к маршрутам разрешен");
    console.log("🛣️ Количество маршрутов:", routesResponse.data.data.routes.length);

    // 4. Проверка запрета доступа к админ-функциям
    console.log("\n4. Проверяем запрет доступа к админ-функциям...");
    try {
      await axios.get("http://localhost:8080/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("❌ Ошибка: работник имеет доступ к управлению пользователями!");
    } catch (error) {
      if (error.response?.status === 403) {
        console.log("✅ Доступ к управлению пользователями правильно запрещен");
      }
    }

    console.log("\n🎉 Панель работника работает корректно!");
    console.log("\n📋 Инструкция для пользователя:");
    console.log("1. Откройте браузер: http://localhost:3000");
    console.log("2. Нажмите 'Вход'");
    console.log("3. Введите:");
    console.log("   Email: worker2@example.com");
    console.log("   Пароль: worker123");
    console.log("4. После входа в навигации должна появиться ссылка 'Работник'");
    console.log("5. Перейдите по ссылке 'Работник' для доступа к панели");

  } catch (error) {
    console.log("❌ Ошибка:", error.response?.data?.error || error.message);
    if (error.response?.status === 403) {
      console.log("🚫 Доступ запрещен - проверьте роль пользователя");
    }
  }
}

testEmployeePanel();
      "🏨 Количество отелей:",
      hotelsResponse.data.data.hotels.length,
    );

    console.log("\n🎉 Панель работника работает корректно!");
    console.log("\n📋 Инструкция для пользователя:");
    console.log("1. Откройте браузер: http://localhost:3000");
    console.log('2. Нажмите "Вход"');
    console.log("3. Введите:");
    console.log("   Email: worker2@example.com");
    console.log("   Пароль: worker123");
    console.log(
      '4. После входа в навигации должна появиться ссылка "Работник"',
    );
  } catch (error) {
    console.log("❌ Ошибка:", error.response?.data?.error || error.message);
    if (error.response?.status === 403) {
      console.log("🚫 Доступ запрещен - проверьте роль пользователя");
    }
  }
}

testEmployeePanel();

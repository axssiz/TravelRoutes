// Примеры использования системы маршрутов
// Копируй в консоль браузера для, тестирования

import routesService from "./services/routesService.js";

// ========== ПРИМЕРЫ ==========

// 1. Получить все маршруты
console.log("Все маршруты:", routesService.getRoutes());

// 2. Поиск маршрута Астана → Алматы
const route1 = routesService.findRoute("Астана", "Алматы");
console.log("Маршрут Астана→Алматы:", route1);

// 3. Добавить новый маршрут вручную
try {
  const newRoute = routesService.addRoute({
    from: "Астана",
    to: "Алматы",
    distance: 1400,
    duration: "17 часов",
    description: "Маршрут через степь казахстана",
    stops: [
      { name: "Караганда", type: "остановка", distance: 700 },
      { name: "Балхаш", type: "остановка", distance: 1050 },
    ],
  });
  console.log("✅ Маршрут добавлен:", newRoute);
} catch (err) {
  console.error("❌ Ошибка:", err.message);
}

// 4. Получить маршрут по ID
const routeId = routesService.getRoutes()[0]?.id;
if (routeId) {
  const route = routesService.getRouteById(routeId);
  console.log("Маршрут по ID:", route);
}

// 5. Обновить маршрут
try {
  const updated = routesService.updateRoute(routeId, {
    duration: "16 часов",
    description: "Обновленное описание",
  });
  console.log("✅ Маршрут обновлен:", updated);
} catch (err) {
  console.error("❌ Ошибка:", err.message);
}

// 6. Удалить маршрут
try {
  routesService.deleteRoute(routeId);
  console.log("✅ Маршрут удален");
} catch (err) {
  console.error("❌ Ошибка:", err.message);
}

// 7. Поиск с автогенерацией
const autoRoute = routesService.findRoute("Шымкент", "Актау");
console.log("Автогенерированный маршрут:", autoRoute);

// 8. Тест валидации
try {
  routesService.addRoute({ from: "Астана", to: "Астана" }); // Ошибка!
} catch (err) {
  console.log("✅ Валидация работает:", err.message);
}

// 9. Очистить все маршруты (ОСТОРОЖНО!)
// routesService.clearAll();
// console.log('❌ Все маршруты удалены');

// ========== TESTS ==========

console.group("ТЕСТЫ");

const tests = [
  {
    name: "Поиск маршрута Астана→Алматы",
    test: () => routesService.findRoute("Астана", "Алматы").distance === 1400,
  },
  {
    name: "Генерация остановок для длинного маршрута",
    test: () => routesService.findRoute("Астана", "Алматы").stops.length > 0,
  },
  {
    name: "Короткий маршрут без остановок",
    test: () => routesService.findRoute("Алматы", "Шымкент").stops.length === 0,
  },
  {
    name: "Валидация: одинаковые города",
    test: () => {
      try {
        routesService.addRoute({ from: "Астана", to: "Астана" });
        return false;
      } catch {
        return true;
      }
    },
  },
  {
    name: "Сохранение и загрузка из localStorage",
    test: () => {
      const before = routesService.getRoutes().length;
      routesService.addRoute({
        from: "Актау",
        to: "Атырау",
        distance: 500,
        duration: "6 часов",
      });
      const after = routesService.getRoutes().length;
      routesService.deleteRoute(
        routesService.getRoutes()[routesService.getRoutes().length - 1].id,
      );
      return after === before + 1;
    },
  },
];

tests.forEach(({ name, test }) => {
  const result = test();
  const icon = result ? "✅" : "❌";
  console.log(`${icon} ${name}`);
});

console.groupEnd();

// ========== ВЫВОД СТАТИСТИКИ ==========

const allRoutes = routesService.getRoutes();
console.group("СТАТИСТИКА");
console.log(`📊 Всего маршрутов: ${allRoutes.length}`);
console.log(
  `📍 Уникальные города (откуда): ${new Set(allRoutes.map((r) => r.from)).size}`,
);
console.log(
  `📍 Уникальные города (куда): ${new Set(allRoutes.map((r) => r.to)).size}`,
);
console.log(
  `🛑 Всего остановок: ${allRoutes.reduce((sum, r) => sum + (r.stops?.length || 0), 0)}`,
);
console.groupEnd();

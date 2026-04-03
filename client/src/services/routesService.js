import {
  KAZAKHSTAN_CITIES,
  CITY_COORDINATES,
  getDistance,
  getDuration,
} from "../constants/cities.js";

const STORAGE_KEY = "routes_database";
const INTERMEDIATE_CITIES = {
  "Астана-Алматы": ["Караганда", "Балхаш"],
  "Астана-Шымкент": ["Актобе", "Кызылорда"],
  "Астана-Тараз": ["Кызылорда", "Шымкент"],
  "Астана-Павлодар": ["Балхаш"],
  "Астана-Актобе": ["Кызылорда"],
  "Алматы-Шымкент": ["Тараз"],
  "Алматы-Тараз": [],
  "Павлодар-Семей": ["Костанай"],
  "Павлодар-Усть-Каменогорск": ["Семей"],
};

class RoutesService {
  constructor() {
    this.initDb();
  }

  initDb() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }

  getRoutes() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  getRouteById(id) {
    return this.getRoutes().find((route) => route.id === id);
  }

  searchRoute(from, to) {
    const routes = this.getRoutes();
    return routes.find(
      (route) =>
        (route.from === from && route.to === to) ||
        (route.from === to && route.to === from),
    );
  }

  findRoute(from, to) {
    let existing = this.searchRoute(from, to);
    if (existing) return existing;

    // Если нет в БД - генерируем маршрут автоматически
    const distance = getDistance(from, to);
    const duration = getDuration(distance);
    const stops = this.generateStops(from, to, distance);

    return {
      id: Date.now(),
      from,
      to,
      distance,
      duration,
      description: `Маршрут от ${from} до ${to}. Расстояние ${distance}км.`,
      stops,
      createdAt: new Date().toISOString(),
    };
  }

  generateStops(from, to, distance) {
    if (distance < 500) return [];

    const key = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;
    const intermediateCities =
      INTERMEDIATE_CITIES[key] || INTERMEDIATE_CITIES[reverseKey] || [];

    if (intermediateCities.length === 0) {
      // Автоматически выбираем города по середине
      return this.findClosestCitiesOnRoute(from, to);
    }

    return intermediateCities.slice(0, 2).map((city, idx) => ({
      id: `stop_${idx}`,
      name: city,
      type: "остановка",
      distance: Math.round(
        distance * ((idx + 1) / (intermediateCities.length + 1)),
      ),
    }));
  }

  findClosestCitiesOnRoute(from, to) {
    const fromCoords = CITY_COORDINATES[from];
    const toCoords = CITY_COORDINATES[to];

    if (!fromCoords || !toCoords) return [];

    const candidates = KAZAKHSTAN_CITIES.filter(
      (city) => city !== from && city !== to,
    );

    const distances = candidates.map((city) => {
      const cityCoords = CITY_COORDINATES[city];
      const dist = this.calcDistance(fromCoords, cityCoords, toCoords);
      return { city, distance: dist };
    });

    return distances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .map((item, idx) => ({
        id: `stop_${idx}`,
        name: item.city,
        type: "остановка",
        distance: item.distance,
      }));
  }

  calcDistance(from, point, to) {
    // Примерный расчет расстояния от маршрута до города
    const crossProduct =
      (to.lng - from.lng) * (point.lat - from.lat) -
      (to.lat - from.lat) * (point.lng - from.lng);
    return Math.abs(crossProduct) / this.getLineDistance(from, to);
  }

  getLineDistance(from, to) {
    const dLat = to.lat - from.lat;
    const dLng = to.lng - from.lng;
    return Math.sqrt(dLat * dLat + dLng * dLng);
  }

  addRoute(routeData) {
    if (!routeData.from || !routeData.to) {
      throw new Error("Укажите города отправления и назначения");
    }

    if (routeData.from === routeData.to) {
      throw new Error("Выберите разные города для маршрута");
    }

    const exists = this.searchRoute(routeData.from, routeData.to);
    if (exists) {
      throw new Error("Этот маршрут уже существует");
    }

    const newRoute = {
      id: Date.now(),
      from: routeData.from,
      to: routeData.to,
      distance:
        parseInt(routeData.distance) ||
        getDistance(routeData.from, routeData.to),
      duration: routeData.duration || getDuration(routeData.distance),
      description:
        routeData.description || `Маршрут ${routeData.from} → ${routeData.to}`,
      stops: routeData.stops || [],
      createdAt: new Date().toISOString(),
    };

    const routes = this.getRoutes();
    routes.push(newRoute);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));

    return newRoute;
  }

  updateRoute(id, routeData) {
    const routes = this.getRoutes();
    const index = routes.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error("Маршрут не найден");
    }

    routes[index] = {
      ...routes[index],
      ...routeData,
      id, // Не позволяем менять ID
      createdAt: routes[index].createdAt,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
    return routes[index];
  }

  deleteRoute(id) {
    const routes = this.getRoutes();
    const filtered = routes.filter((r) => r.id !== id);

    if (filtered.length === routes.length) {
      throw new Error("Маршрут не найден");
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  clearAll() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
}

export default new RoutesService();

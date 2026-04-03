// server/src/services/routeService.js
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");

const prisma = new PrismaClient();

/**
 * Сервис для работы с маршрутами
 */
class RouteService {
  /**
   * Получить все маршруты пользователя
   */
  async getUserRoutes(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const routes = await prisma.route.findMany({
      where: { userId: parseInt(userId) },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.route.count({
      where: { userId: parseInt(userId) },
    });

    return {
      routes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Получить маршрут по ID
   */
  async getRouteById(id) {
    const route = await prisma.route.findUnique({
      where: { id: parseInt(id) },
      include: { user: true },
    });

    if (!route) {
      throw new Error("Маршрут не найден");
    }

    return route;
  }

  /**
   * Создать маршрут
   */
  async createRoute(userId, data) {
    const { startLocation, endLocation, distance, duration, transportType } =
      data;

    // Валидация
    if (!startLocation || startLocation.trim().length === 0) {
      throw new Error("Точка А (начало) обязательна");
    }

    if (!endLocation || endLocation.trim().length === 0) {
      throw new Error("Точка B (конец) обязательна");
    }

    if (!distance || isNaN(distance) || distance <= 0) {
      throw new Error("Расстояние должно быть положительным числом");
    }

    if (!duration || isNaN(duration) || duration <= 0) {
      throw new Error("Время в пути должно быть положительным числом");
    }

    const route = await prisma.route.create({
      data: {
        startLocation: startLocation.trim(),
        endLocation: endLocation.trim(),
        distance: parseFloat(distance),
        duration: parseInt(duration),
        transportType: transportType || "car",
        userId: parseInt(userId),
      },
    });

    return route;
  }

  /**
   * Обновить маршрут
   */
  async updateRoute(id, userId, data) {
    const { startLocation, endLocation, distance, duration, transportType } =
      data;

    const route = await prisma.route.findUnique({
      where: { id: parseInt(id) },
    });

    if (!route) {
      throw new Error("Маршрут не найден");
    }

    if (route.userId !== parseInt(userId)) {
      throw new Error("Нет доступа к этому маршруту");
    }

    const updateData = {};

    if (startLocation) {
      updateData.startLocation = startLocation.trim();
    }

    if (endLocation) {
      updateData.endLocation = endLocation.trim();
    }

    if (distance !== undefined && !isNaN(distance) && distance > 0) {
      updateData.distance = parseFloat(distance);
    }

    if (duration !== undefined && !isNaN(duration) && duration > 0) {
      updateData.duration = parseInt(duration);
    }

    if (transportType) {
      updateData.transportType = transportType;
    }

    const updatedRoute = await prisma.route.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return updatedRoute;
  }

  /**
   * Удалить маршрут
   */
  async deleteRoute(id, userId) {
    const route = await prisma.route.findUnique({
      where: { id: parseInt(id) },
    });

    if (!route) {
      throw new Error("Маршрут не найден");
    }

    if (route.userId !== parseInt(userId)) {
      throw new Error("Нет доступа к этому маршруту");
    }

    // Удалить все избранные связанные с этим маршрутом
    await prisma.favorite.deleteMany({
      where: { routeId: parseInt(id) },
    });

    await prisma.route.delete({
      where: { id: parseInt(id) },
    });

    return { message: "Маршрут удален успешно" };
  }

  /**
   * Получить все маршруты для админ панели
   */
  async getAllRoutes(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const routes = await prisma.route.findMany({
      skip,
      take: parseInt(limit),
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.route.count();

    return {
      routes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Поиск маршрута через Google Directions API и расчет остановок.
   */
  async getRoutePlan(origin, destination) {
    if (!origin || !destination) {
      throw new Error("Укажите точки отправления и назначения");
    }

    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;

    let routeData;

    if (googleApiKey) {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        origin,
      )}&destination=${encodeURIComponent(destination)}&region=kz&key=${googleApiKey}`;

      try {
        const response = await axios.get(url);
        const json = response.data;

        if (json.status !== "OK" || !json.routes || json.routes.length === 0) {
          throw new Error(`Google Directions: ${json.status} - ${json.error_message || "нет данных"}`);
        }

        const mainRoute = json.routes[0];
        const leg = mainRoute.legs[0];

        routeData = {
          distance: leg.distance.value, // метры
          duration: leg.duration.value, // секунды
          overviewPolyline: mainRoute.overview_polyline ? mainRoute.overview_polyline.points : "",
          startLocation: leg.start_location,
          endLocation: leg.end_location,
          steps: leg.steps.map((step) => ({
            start_location: step.start_location,
            end_location: step.end_location,
            distance: step.distance.value,
            duration: step.duration.value,
            instructions: step.html_instructions,
          })),
        };
      } catch (err) {
        console.error("Google Directions API error:", err.message);
        // Падение на резерв
        routeData = null;
      }
    }

    if (!routeData) {
      // Фейковые маршруты (fallback) - выбираем случайный популярный маршрут
      const mockRoutes = [
        {
          distance: 700000,
          duration: 27000,
          startLocation: { lat: 51.1605, lng: 71.4704 }, // Астана
          endLocation: { lat: 43.2383, lng: 76.9458 }, // Алматы
        },
        {
          distance: 500000,
          duration: 18000,
          startLocation: { lat: 51.1605, lng: 71.4704 }, // Астана
          endLocation: { lat: 42.3417, lng: 69.5901 }, // Шымкент
        },
        {
          distance: 600000,
          duration: 22000,
          startLocation: { lat: 43.2383, lng: 76.9458 }, // Алматы
          endLocation: { lat: 42.9044, lng: 71.3814 }, // Тараз
        },
        {
          distance: 450000,
          duration: 16000,
          startLocation: { lat: 51.1605, lng: 71.4704 }, // Астана
          endLocation: { lat: 53.3054, lng: 69.3646 }, // Кокшетау
        },
      ];

      const randomRoute = mockRoutes[Math.floor(Math.random() * mockRoutes.length)];
      routeData = {
        ...randomRoute,
        overviewPolyline: "",
        steps: [],
      };
    }

    const stopCandidates = [
      { name: "Караганда", lat: 49.8067, lng: 73.0854 },
      { name: "Балхаш", lat: 46.8524, lng: 74.9808 },
      { name: "Шымкент", lat: 42.3417, lng: 69.5901 },
      { name: "Тараз", lat: 42.9044, lng: 71.3814 },
      { name: "Кокшетау", lat: 53.3054, lng: 69.3646 },
      { name: "Астана", lat: 51.1605, lng: 71.4704 },
      { name: "Алматы", lat: 43.2383, lng: 76.9458 },
      { name: "Актобе", lat: 50.3038, lng: 57.1644 },
      { name: "Атырау", lat: 43.6631, lng: 51.3787 },
      { name: "Павлодар", lat: 52.2864, lng: 76.9401 },
    ];

    // Когда маршрут длинный, подбираем точки остановок на 1/3 и 2/3 пути.
    const needStops = routeData.duration >= 18000 || routeData.distance >= 500000;
    const stops = [];
    if (needStops) {
      const chooseStop = (frac) => {
        const lat = routeData.startLocation.lat + (routeData.endLocation.lat - routeData.startLocation.lat) * frac;
        const lng = routeData.startLocation.lng + (routeData.endLocation.lng - routeData.startLocation.lng) * frac;

        let nearest = null;
        let nearestDist = Infinity;

        stopCandidates.forEach((city) => {
          if (city.name === origin || city.name === destination) return;
          const d = getDistanceMeters({ lat, lng }, city);
          if (!nearest || d < nearestDist) {
            nearest = city;
            nearestDist = d;
          }
        });

        if (nearest && !stops.some((s) => s.name === nearest.name)) {
          stops.push({ ...nearest, distanceToTarget: Math.round(nearestDist) });
        }
      };

      chooseStop(0.33);
      chooseStop(0.66);
    }

    // Подтягиваем отели для остановов
    for (const stop of stops) {
      const hotels = await this.findHotelsNearby(stop.lat, stop.lng);
      if (hotels.length) {
        stop.hotels = hotels.slice(0, 3);
      } else {
        stop.hotels = getMockHotels(stop.name);
      }
    }

    // Получаем рекомендации для города-пункта назначения
    const destinationCity = destination;
    const recommendedHotels = await this.findHotelsNearby(routeData.endLocation.lat, routeData.endLocation.lng, 100);
    const recommendedPlaces = await this.getAttractionsByCity(destinationCity);

    return {
      from: origin,
      to: destination,
      distanceMeters: routeData.distance,
      durationSeconds: routeData.duration,
      routeEncoded: routeData.overviewPolyline,
      stops,
      // Рекомендации для пункта назначения
      destinationRecommendations: {
        hotels: recommendedHotels.length > 0 
          ? recommendedHotels.slice(0, 5) 
          : getMockHotels(destinationCity).slice(0, 5),
        attractions: recommendedPlaces.length > 0 
          ? recommendedPlaces 
          : getMockAttractions(destinationCity),
      },
    };
  }

  async findHotelsNearby(lat, lng, radiusKm = 70) {
    const haversineRadius = radiusKm * 1000;

    const allHotels = await prisma.hotel.findMany({
      select: { id: true, name: true, city: true, imageUrl: true, latitude: true, longitude: true, price: true, rating: true },
    });

    const hotelsNearby = allHotels
      .map((hotel) => ({
        ...hotel,
        distance: getDistanceMeters({ lat, lng }, { lat: hotel.latitude, lng: hotel.longitude }),
      }))
      .filter((hotel) => hotel.distance <= haversineRadius)
      .sort((a, b) => a.distance - b.distance);

    return hotelsNearby;
  }

  async getAttractionsByCity(cityName) {
    // Пытаемся найти достопримечательности по городу в каталоге
    try {
      const attractions = await prisma.attraction.findMany({
        where: {
          city: {
            contains: cityName,
            mode: 'insensitive'
          }
        },
        take: 6,
      });
      return attractions;
    } catch (err) {
      // Таблица может не существовать, возвращаем пустой массив
      return [];
    }
  }
}

function getDistanceMeters(pointA, pointB) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; // радиус Земли м
  const dLat = toRad(pointB.lat - pointA.lat);
  const dLon = toRad(pointB.lng - pointA.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pointA.lat)) *
      Math.cos(toRad(pointB.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getMockHotels(cityName) {
  const allMock = {
    Караганда: [
      { id: "kg-1", name: "Мини-отель Караганда", city: "Караганда", price: 4500, rating: 4.0 },
      { id: "kg-2", name: "Хостел Central Karaganda", city: "Караганда", price: 2800, rating: 3.8 },
      { id: "kg-3", name: "Эконом-гостиница", city: "Караганда", price: 3700, rating: 4.1 },
      { id: "kg-4", name: "Budget Hotel Karaganda", city: "Караганда", price: 3200, rating: 3.9 },
      { id: "kg-5", name: "Комфорт-отель", city: "Караганда", price: 5100, rating: 4.2 },
    ],
    Балхаш: [
      { id: "bal-1", name: "Balhash Mini-Hotel", city: "Балхаш", price: 4100, rating: 3.9 },
      { id: "bal-2", name: "Бюджетный хостел", city: "Балхаш", price: 2500, rating: 3.7 },
      { id: "bal-3", name: "Озерный отель", city: "Балхаш", price: 4800, rating: 4.0 },
      { id: "bal-4", name: "Гостевой дом", city: "Балхаш", price: 3400, rating: 3.8 },
    ],
    Шымкент: [
      { id: "shy-1", name: "Отель Шымкент", city: "Шымкент", price: 5200, rating: 4.2 },
      { id: "shy-2", name: "Хостел на Байдибеке", city: "Шымкент", price: 3100, rating: 3.9 },
      { id: "shy-3", name: "Мини-отель SilkWay", city: "Шымкент", price: 4600, rating: 4.0 },
      { id: "shy-4", name: "Азия Гостиница", city: "Шымкент", price: 4900, rating: 4.1 },
      { id: "shy-5", name: "Бюджет Plaza", city: "Шымкент", price: 2900, rating: 3.7 },
    ],
    Тараз: [
      { id: "tar-1", name: "Тараз Мини-Отель", city: "Тараз", price: 4000, rating: 4.0 },
      { id: "tar-2", name: "Гостиница Арай", city: "Тараз", price: 4500, rating: 4.1 },
      { id: "tar-3", name: "Историческое подворье", city: "Тараз", price: 4200, rating: 4.0 },
      { id: "tar-4", name: "Budget Inn Tara", city: "Тараз", price: 3600, rating: 3.8 },
    ],
    Кокшетау: [
      { id: "kok-1", name: "Kokshetau Budget Hotel", city: "Кокшетау", price: 4300, rating: 4.0 },
      { id: "kok-2", name: "Hostel Lake Relax", city: "Кокшетау", price: 2900, rating: 3.8 },
      { id: "kok-3", name: "Озеро Отель", city: "Кокшетау", price: 4600, rating: 4.1 },
      { id: "kok-4", name: "Лесной хостел", city: "Кокшетау", price: 3200, rating: 3.9 },
    ],
    Актобе: [
      { id: "akt-1", name: "Aktobe Hotel", city: "Актобе", price: 4400, rating: 4.0 },
      { id: "akt-2", name: "Мини-гостиница Арлан", city: "Актобе", price: 3800, rating: 3.9 },
      { id: "akt-3", name: "Budget Aktobe", city: "Актобе", price: 3100, rating: 3.8 },
    ],
    Атырау: [
      { id: "aty-1", name: "Atyrau Hotel", city: "Атырау", price: 5000, rating: 4.1 },
      { id: "aty-2", name: "Берег Каспия", city: "Атырау", price: 4200, rating: 4.0 },
      { id: "aty-3", name: "Портовый хостел", city: "Атырау", price: 2800, rating: 3.7 },
    ],
    Павлодар: [
      { id: "pav-1", name: "Pavlodar Hotel", city: "Павлодар", price: 4600, rating: 4.1 },
      { id: "pav-2", name: "Иртышский отель", city: "Павлодар", price: 4100, rating: 4.0 },
      { id: "pav-3", name: "Budget Pavlodar", city: "Павлодар", price: 3200, rating: 3.8 },
    ],
  };

  const mock = allMock[cityName] || [];
  // Возвращаем случайный набор (до 3) вместо всегда одних и тех же
  if (mock.length > 3) {
    const shuffled = [...mock].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }
  return mock;
}

function getMockAttractions(cityName) {
  const attractions = {
    Астана: [
      { id: "ast-1", name: "Байтерек", type: "памятник", description: "Символ Казахстана", rating: 4.8 },
      { id: "ast-2", name: "Дворец Мира и Согласия", type: "архитектура", description: "Пирамида Нормана Фостера", rating: 4.7 },
      { id: "ast-3", name: "Мечеть Хазрет Султана", type: "религиозное", description: "Одна из крупнейших мечетей", rating: 4.6 },
      { id: "ast-4", name: "Парк роботов", type: "парк", description: "Развлекательный парк", rating: 4.2 },
      { id: "ast-5", name: "Национальный музей", type: "музей", description: "История Казахстана", rating: 4.5 },
      { id: "ast-6", name: "Аквапарк Раджа", type: "развлечения", description: "Водный парк", rating: 4.3 },
    ],
    Алматы: [
      { id: "alm-1", name: "Горнолыжный комплекс Чимбулак", type: "спорт", description: "Горнолыжный курорт", rating: 4.6 },
      { id: "alm-2", name: "Озеро Турген", type: "природа", description: "Горное озеро", rating: 4.7 },
      { id: "alm-3", name: "Большое Алматинское озеро", type: "природа", description: "Ледниковое озеро", rating: 4.8 },
      { id: "alm-4", name: "Базилика Вознесения", type: "архитектура", description: "Православный храм", rating: 4.5 },
      { id: "alm-5", name: "Ботанический сад", type: "парк", description: "Сад редких растений", rating: 4.4 },
      { id: "alm-6", name: "Национальный музей Казахстана", type: "музей", description: "История и культура", rating: 4.6 },
    ],
    Шымкент: [
      { id: "shy-1", name: "Мавзолей Аулиеата", type: "памятник", description: "Историческое место", rating: 4.5 },
      { id: "shy-2", name: "Площадь Абая", type: "архитектура", description: "Культурный центр", rating: 4.3 },
      { id: "shy-3", name: "Старый город", type: "история", description: "Древний торговый центр", rating: 4.4 },
      { id: "shy-4", name: "Парк культуры", type: "парк", description: "Местный парк отдыха", rating: 4.1 },
      { id: "shy-5", name: "Музей истории", type: "музей", description: "История Шымкента", rating: 4.2 },
    ],
    Тараз: [
      { id: "tar-1", name: "Мечеть Касасая", type: "религиозное", description: "Древняя мечеть", rating: 4.4 },
      { id: "tar-2", name: "Мавзолей Кюль-Тегина", type: "памятник", description: "Древний памятник", rating: 4.5 },
      { id: "tar-3", name: "Цитадель Тараза", type: "история", description: "Древняя крепость", rating: 4.6 },
      { id: "tar-4", name: "Археологический музей", type: "музей", description: "Артефакты Шелкового пути", rating: 4.5 },
    ],
    Кокшетау: [
      { id: "kok-1", name: "Озеро Кокшетау", type: "природа", description: "Красивое озеро", rating: 4.6 },
      { id: "kok-2", name: "Национальный парк Кокшетау", type: "парк", description: "Природный заповедник", rating: 4.7 },
      { id: "kok-3", name: "Гора Букпа", type: "природа", description: "Панорамный вид", rating: 4.5 },
    ],
    Актобе: [
      { id: "akt-1", name: "Святилище Кебира", type: "религиозное", description: "Духовное место", rating: 4.3 },
      { id: "akt-2", name: "Музей изобразительных искусств", type: "музей", description: "Казахское искусство", rating: 4.2 },
      { id: "akt-3", name: "Парк Акмешита", type: "парк", description: "Городской парк", rating: 4.0 },
    ],
    Атырау: [
      { id: "aty-1", name: "Музей деревянной архитектуры", type: "музей", description: "Традиционная архитектура", rating: 4.2 },
      { id: "aty-2", name: "Мечеть Святого Хасана", type: "религиозное", description: "Красивая мечеть", rating: 4.4 },
      { id: "aty-3", name: "Набережная Каспия", type: "природа", description: "Морской пейзаж", rating: 4.3 },
    ],
    Павлодар: [
      { id: "pav-1", name: "Знак Павлодара", type: "памятник", description: "Известная достопримечательность", rating: 4.1 },
      { id: "pav-2", name: "Музей Николая Назарбаева", type: "музей", description: "История региона", rating: 4.2 },
      { id: "pav-3", name: "Парк победы", type: "парк", description: "Мемориальный парк", rating: 4.0 },
    ],
  };

  return attractions[cityName] || [];
}

module.exports = new RouteService();

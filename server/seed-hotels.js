// seed-hotels.js
const { PrismaClient } = require("@prisma/client");

async function seedHotels() {
  const prisma = new PrismaClient();

  try {
    // Создаем тестовые отели с координатами
    const hotels = [
      {
        name: "Гранд Отель Москва",
        description:
          "Роскошный отель в центре Москвы с видом на Красную площадь",
        price: 15000,
        rating: 4.5,
        city: "Москва",
        latitude: 55.7558,
        longitude: 37.6176,
        image: "/uploads/hotel1.jpg",
      },
      {
        name: "Спаская Гостиница",
        description: "Уютный отель в историческом центре Санкт-Петербурга",
        price: 12000,
        rating: 4.2,
        city: "Санкт-Петербург",
        latitude: 59.9343,
        longitude: 30.3351,
        image: "/uploads/hotel2.jpg",
      },
      {
        name: "Золотое Кольцо Отель",
        description: "Традиционный отель в Ярославле с русской атмосферой",
        price: 8000,
        rating: 4.0,
        city: "Ярославль",
        latitude: 57.6261,
        longitude: 39.8845,
        image: "/uploads/hotel3.jpg",
      },
      {
        name: "Байкал Плаза",
        description: "Современный отель с видом на озеро Байкал",
        price: 18000,
        rating: 4.7,
        city: "Иркутск",
        latitude: 52.2869,
        longitude: 104.305,
        image: "/uploads/hotel4.jpg",
      },
      {
        name: "Красная Поляна Резорт",
        description: "Горный курортный отель в Сочи",
        price: 22000,
        rating: 4.8,
        city: "Сочи",
        latitude: 43.6804,
        longitude: 40.2051,
        image: "/uploads/hotel5.jpg",
      },
    ];

    console.log("Добавляем тестовые отели...");

    for (const hotel of hotels) {
      const created = await prisma.hotel.create({
        data: hotel,
      });
      console.log(`✅ Создан отель: ${created.name}`);
    }

    console.log("Все отели добавлены!");
  } catch (error) {
    console.error("Ошибка при добавлении отелей:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedHotels();

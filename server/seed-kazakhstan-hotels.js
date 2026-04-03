// seed-kazakhstan-hotels.js
const { PrismaClient } = require("@prisma/client");

async function seedKazakhstanHotels() {
  const prisma = new PrismaClient();

  try {
    // Сначала удалим все существующие отели
    await prisma.hotel.deleteMany({});
    console.log("Удалены все существующие отели");

    // Создаем отели Казахстана с координатами
    const hotels = [
      {
        name: "Rixos President Astana",
        description:
          "Роскошный отель в столице Казахстана с современным дизайном и высоким уровнем сервиса",
        price: 25000,
        rating: 4.8,
        city: "Астана",
        latitude: 51.1282,
        longitude: 71.4304,
        imageUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      },
      {
        name: "InterContinental Almaty",
        description:
          "Пятизвездочный отель в центре Алматы с панорамным видом на горы",
        price: 22000,
        rating: 4.6,
        city: "Алматы",
        latitude: 43.2389,
        longitude: 76.8897,
        imageUrl:
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      },
      {
        name: "Hilton Garden Inn Almaty",
        description: "Комфортный бизнес-отель в деловом центре Алматы",
        price: 18000,
        rating: 4.4,
        city: "Алматы",
        latitude: 43.2389,
        longitude: 76.8897,
        imageUrl:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      },
      {
        name: "Rixos Khadisha Shymkent",
        description: "Современный отель в Шымкенте с бассейном и спа-центром",
        price: 15000,
        rating: 4.3,
        city: "Шымкент",
        latitude: 42.3417,
        longitude: 69.5901,
        imageUrl:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
      },
      {
        name: "Holiday Inn Astana",
        description: "Удобный отель в Астане с конференц-залами и ресторанами",
        price: 16000,
        rating: 4.2,
        city: "Астана",
        latitude: 51.1282,
        longitude: 71.4304,
        imageUrl:
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      },
      {
        name: "Grand Hotel Almaty",
        description:
          "Исторический отель в центре Алматы с традиционной архитектурой",
        price: 19000,
        rating: 4.5,
        city: "Алматы",
        latitude: 43.2389,
        longitude: 76.8897,
        imageUrl:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      },
      {
        name: "Ramada Plaza Atyrau",
        description: "Бизнес-отель в Атырау с видом на реку",
        price: 14000,
        rating: 4.1,
        city: "Атырау",
        latitude: 47.0945,
        longitude: 51.9238,
        imageUrl:
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      },
      {
        name: "Kazakhstan Hotel Astana",
        description: "Государственный отель в столице с конференц-услугами",
        price: 13000,
        rating: 4.0,
        city: "Астана",
        latitude: 51.1282,
        longitude: 71.4304,
        imageUrl:
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      },
    ];

    console.log("Добавляем отели Казахстана...");

    for (const hotel of hotels) {
      const created = await prisma.hotel.create({
        data: hotel,
      });
      console.log(`✅ Создан отель: ${created.name} (${created.city})`);
    }

    console.log("Все отели Казахстана добавлены!");
  } catch (error) {
    console.error("Ошибка при добавлении отелей:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedKazakhstanHotels();

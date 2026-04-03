// server/prisma/seed.js
/**
 * Скрипт для заполнения БД начальными данными
 * Запуск: npm run prisma:seed
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начало заполнения БД...");

  // Удаление старых данных
  await prisma.favorite.deleteMany();
  await prisma.route.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  // Создание администратора
  const admin = await prisma.user.create({
    data: {
      name: "Администратор",
      email: "admin@travel.com",
      phone: "+77001234567",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });

  console.log("✅ Администратор создан:", admin.email);

  // Создание обычных пользователей
  const user1 = await prisma.user.create({
    data: {
      name: "Иван Петров",
      email: "ivan@example.com",
      phone: "+77012345678",
      password: await bcrypt.hash("password123", 10),
      role: "user",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Мария Исакова",
      email: "maria@example.com",
      phone: "+77023456789",
      password: await bcrypt.hash("password123", 10),
      role: "user",
    },
  });

  console.log("✅ Пользователи созданы");

  // Создание отелей
  const hotels = await prisma.hotel.createMany({
    data: [
      {
        name: "Hilton Almaty",
        description:
          "Люксовый отель в центре Алматы с панорамным видом на горы.",
        price: 350,
        rating: 4.8,
        city: "Алматы",
        latitude: 43.2311,
        longitude: 76.9453,
        imageUrl:
          "https://www.hilton.com/im/en/ALADTDI/13233599/facade-3.jpg?impolicy=crop&cw=5174&ch=2896&gravity=NorthWest&xposition=0&yposition=168&rw=768&rh=430",
      },
      {
        name: "Rixos Premium Astana",
        description:
          "Премиум отель с современным сервисом в столице Казахстана.",
        price: 280,
        rating: 4.6,
        city: "Астана",
        latitude: 51.1649,
        longitude: 71.4719,
        imageUrl: "https://www.ahstatic.com/photos/b1q3_ho_00_p_1024x768.jpg",
      },
      {
        name: "Ibis Styles Karaganda",
        description: "Уютный отель по доступной цене в центре Караганды.",
        price: 120,
        rating: 4.2,
        city: "Караганда",
        latitude: 49.8016,
        longitude: 73.1038,
        imageUrl:
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/752509056.jpg?k=d90317a782655375b558c3ab4cb98cd1d404add373a4df74d8fbf6e7b90c4e4b&o=",
      },
      {
        name: "Turkistan Palace",
        description:
          "Исторический отель с современным комфортом в древнем городе.",
        price: 150,
        rating: 4.4,
        city: "Туркестан",
        latitude: 43.2975,
        longitude: 68.2625,
        imageUrl:
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/378435398.jpg?k=0c5099689cf20434740058d55561db6937eb10b35d549ee0bb7d686443b9b1f2&o=",
      },
      {
        name: "Big Almaty Lake Resort",
        description: "Горный курорт на берегу красивейшего озера Казахстана.",
        price: 450,
        rating: 4.9,
        city: "Алматы",
        latitude: 43.2526,
        longitude: 77.0598,
        imageUrl:
          "https://media-cdn.tripadvisor.com/media/photo-s/0f/ba/4e/d4/caption.jpg",
      },
      {
        name: "Aktau Beach Resort",
        description: "Пляжный курорт на Каспийском море с песчаными пляжами.",
        price: 200,
        rating: 4.3,
        city: "Актау",
        latitude: 43.6589,
        longitude: 51.2022,
        imageUrl:
          "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/18/53/63/caption.jpg?w=1200&h=-1&s=1",
      },
      {
        name: "Rixos Water World Aktau",
        description:
          "Единственный 5-звездочный All Inclusive курорт в Центральной Азии с аквапарком, частным пляжем и тематическим парком.",
        price: 550,
        rating: 4.9,
        city: "Актау",
        latitude: 43.6725,
        longitude: 51.1845,
        imageUrl:
          "https://cf.bstatic.com/xdata/images/hotel/max1024x768/766124268.jpg?k=790e7e0c052c99d02eb2fbfa54cbb10353a385ef588a7db85b7aa62c1253b792&o=",
      },
    ],
  });

  console.log("✅ Отели созданы:", hotels.count);

  // Создание маршрутов
  const routes = await prisma.route.createMany({
    data: [
      {
        startLocation: "Центр Алматы",
        endLocation: "Озеро Турмункожай",
        distance: 25,
        duration: 45,
        transportType: "car",
        userId: user1.id,
      },
      {
        startLocation: "Площадь Республики (Астана)",
        endLocation: "Дворец мира и согласия",
        distance: 5,
        duration: 10,
        transportType: "walking",
        userId: user1.id,
      },
      {
        startLocation: "ЖД вокзал (Алматы)",
        endLocation: "Панфиловский парк",
        distance: 3,
        duration: 15,
        transportType: "walking",
        userId: user2.id,
      },
    ],
  });

  console.log("✅ Маршруты созданы:", routes.count);

  console.log("🎉 БД заполнена успешно!");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при заполнении БД:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

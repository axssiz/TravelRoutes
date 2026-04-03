// test-images.mjs - Тест API для проверки imageUrl

async function testAPI() {
  try {
    const response = await fetch("http://localhost:5000/api/hotels");
    const data = await response.json();

    console.log("\n=== API Response ===");
    console.log("Status:", response.status);
    console.log("Success:", data.success);

    if (data.data && data.data.hotels) {
      console.log(`\nОтелей найдено: ${data.data.hotels.length}`);
      console.log("\n=== Первый отель ===");
      const hotel = data.data.hotels[0];
      console.log(`Имя: ${hotel.name}`);
      console.log(`Цена: $${hotel.price}`);
      console.log(`Рейтинг: ${hotel.rating}`);
      console.log(`Город: ${hotel.city}`);
      console.log(`ImageURL: ${hotel.imageUrl}`);
      console.log(`ImageURL тип: ${typeof hotel.imageUrl}`);
      console.log(
        `ImageURL пусто?: ${!hotel.imageUrl || hotel.imageUrl === ""}`,
      );

      console.log("\n=== Все поля первого отеля ===");
      console.log(JSON.stringify(hotel, null, 2));
    } else {
      console.log("Данные отелей не найдены");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Ошибка:", error.message);
  }
}

testAPI();

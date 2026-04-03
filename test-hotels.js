const http = require("http");

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: path,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          data: data,
        });
      });
    });

    req.on("error", reject);
    req.end();
  });
}

async function testHotels() {
  try {
    console.log("🔍 Проверка отелей с координатами...\n");

    const response = await makeRequest("/api/hotels?page=1&limit=100");
    const result = JSON.parse(response.data);

    console.log(`📊 Статус: ${response.status}`);
    console.log(`📍 Найдено отелей: ${result.data.hotels.length}\n`);

    result.data.hotels.forEach((hotel, idx) => {
      console.log(`${idx + 1}. ${hotel.name}`);
      console.log(`   Город: ${hotel.city}`);
      console.log(`   Координаты: ${hotel.latitude}, ${hotel.longitude}`);
      console.log(`   Цена: $${hotel.price}`);
      console.log(`   Рейтинг: ${hotel.rating}⭐\n`);
    });

    // Check if coordinates are present
    const withCoords = result.data.hotels.filter(
      (h) => h.latitude && h.longitude,
    );
    console.log(
      `✅ Отелей с координатами: ${withCoords.length}/${result.data.hotels.length}`,
    );
  } catch (error) {
    console.error("❌ Ошибка:", error.message);
  }
}

testHotels();

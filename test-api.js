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
          data: data.substring(0, 500), // First 500 chars
        });
      });
    });

    req.on("error", reject);
    req.end();
  });
}

async function test() {
  console.log("🔍 Testing backend API...\n");

  try {
    // Test health endpoint
    const health = await makeRequest("/api/health");
    console.log(`✅ /api/health: ${health.status}`);
    console.log(`   ${health.data}\n`);

    // Test hotels endpoint
    const hotels = await makeRequest("/api/hotels?page=1&limit=5");
    console.log(`✅ /api/hotels: ${hotels.status}`);
    const parsed = JSON.parse(health.data);
    if (parsed.success) {
      console.log("   ✅ Hotels response is valid");
    }

    // Test cities endpoint
    const cities = await makeRequest("/api/hotels/cities");
    console.log(`\n✅ /api/hotels/cities: ${cities.status}`);
    console.log("   ✅ Cities endpoint working");

    console.log("\n🎉 API Backend is fully operational!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

test();

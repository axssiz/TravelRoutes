// test-api.js
const http = require("http");

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/hotels",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const req = http.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const response = JSON.parse(data);
      console.log("Status:", res.statusCode);
      console.log("Full response structure:");
      console.log(JSON.stringify(response, null, 2));
      console.log("response.data exists:", !!response.data);
      console.log("response.data.success:", response.data?.success);
      console.log("response.data.data exists:", !!response.data?.data);
      console.log(
        "response.data.data.hotels exists:",
        !!response.data?.data?.hotels,
      );
      console.log("response.data.hotels exists:", !!response.data?.hotels);
      if (response.data?.data?.hotels) {
        console.log(
          "Hotels in data.data.hotels:",
          response.data.data.hotels.length,
        );
      }
      if (response.data?.hotels) {
        console.log("Hotels in data.hotels:", response.data.hotels.length);
      }
    } catch (e) {
      console.log("Raw response:", data);
    }
  });
});

req.on("error", (e) => {
  console.error("Error:", e.message);
});

req.end();

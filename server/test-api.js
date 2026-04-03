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
      console.log("Hotels count:", response.data?.hotels?.length || 0);
      if (response.data?.hotels?.length > 0) {
        console.log("First hotel:", response.data.hotels[0].name);
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

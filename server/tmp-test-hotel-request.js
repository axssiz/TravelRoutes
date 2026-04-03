const axios = require("axios");

async function test() {
  try {
    const res = await axios.get("http://localhost:5000/api/hotels", {
      params: {
        city: "Астана",
        page: 1,
        limit: 12,
      },
    });
    console.log("status", res.status);
    console.log("data", JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.log("status", err.response.status);
      console.log("data", JSON.stringify(err.response.data, null, 2));
    } else {
      console.log("error", err.message);
    }
  }
}

test();

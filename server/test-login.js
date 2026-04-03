const http = require("http");

// Функция для отправки POST запроса
function postRequest(path, data, callback) {
  const postData = JSON.stringify(data);
  const options = {
    hostname: "localhost",
    port: 5000,
    path: path,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = http.request(options, (res) => {
    let body = "";
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      callback(res.statusCode, body);
    });
  });

  req.on("error", (e) => {
    console.log("Request error:", e.message);
  });

  req.write(postData);
  req.end();
}

// Тестирование логина
console.log("Testing admin login...");
postRequest(
  "/api/auth/login",
  {
    email: "admin@example.com",
    password: "admin123",
  },
  (status, response) => {
    console.log("Status:", status);
    if (status === 200) {
      try {
        const data = JSON.parse(response);
        console.log("Login successful!");
        console.log("User:", data.data.user.name, data.data.user.role);
        console.log("Token length:", data.data.token.length);

        // Теперь тестируем доступ к защищенному роуту
        const options = {
          hostname: "localhost",
          port: 5000,
          path: "/api/admin/stats",
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.data.token}`,
          },
        };

        const req = http.request(options, (res) => {
          let body = "";
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            console.log("Admin stats status:", res.statusCode);
            if (res.statusCode === 200) {
              console.log("Admin access successful!");
            } else {
              console.log("Admin access failed:", body);
            }
          });
        });

        req.on("error", (e) => {
          console.log("Admin request error:", e.message);
        });

        req.end();
      } catch (e) {
        console.log("Parse error:", e.message);
      }
    } else {
      console.log("Login failed:", response);
    }
  },
);

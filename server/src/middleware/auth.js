// server/src/middleware/auth.js
const jwt = require("jsonwebtoken");

/**
 * Middleware для проверки JWT токена
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "Токен не предоставлен" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Неверный токен" });
    }
    req.user = user;
    next();
  });
};

/**
 * Middleware для проверки роли администратора
 */
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Только администраторы имеют доступ" });
  }
  next();
};

/**
 * Middleware для проверки роли работника
 */
const employeeOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "employee") {
    return res.status(403).json({ error: "Только работники имеют доступ" });
  }
  next();
};

module.exports = { authenticateToken, adminOnly, employeeOnly };

// server/src/middleware/errorHandler.js

/**
 * Глобальный обработчик ошибок
 */
const errorHandler = (err, req, res, next) => {
  console.error("Ошибка:", err);

  if (err.message === "Not found") {
    return res.status(404).json({ error: "Ресурс не найден" });
  }

  if (err.message.includes("Unique constraint")) {
    return res.status(400).json({ error: "Такие данные уже существуют" });
  }

  res.status(err.status || 500).json({
    error: err.message || "Внутренняя ошибка сервера",
  });
};

module.exports = errorHandler;

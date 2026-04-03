// server/src/controllers/hotelController.js
const hotelService = require("../services/hotelService");
const https = require("https");
const http = require("http");

/**
 * Получить все отели
 */
exports.getHotels = async (req, res, next) => {
  try {
    console.debug("[hotelController.getHotels] query", req.query);
    const result = await hotelService.getHotels(req.query);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[hotelController.getHotels] error", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Прокси для загрузки изображений (обходит CORS проблемы)
 */
exports.proxyImage = async (req, res) => {
  try {
    const imageUrl = req.query.url;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: "URL параметр обязателен",
      });
    }

    // Валидация URL - должен быть от известного сервиса
    if (!imageUrl.startsWith("https://images.unsplash.com/")) {
      return res.status(400).json({
        success: false,
        error: "Допускаются только изображения от unsplash.com",
      });
    }

    const protocol = imageUrl.startsWith("https") ? https : http;

    protocol
      .get(
        imageUrl,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        },
        (imageRes) => {
          // Копируем заголовки изображения
          res.setHeader("Content-Type", imageRes.headers["content-type"]);
          res.setHeader("Cache-Control", "public, max-age=31536000");
          res.setHeader("Access-Control-Allow-Origin", "*");

          imageRes.pipe(res);
        },
      )
      .on("error", (err) => {
        console.error("[hotelController.proxyImage] error:", err);
        res.status(500).json({
          success: false,
          error: "Ошибка загрузки изображения",
        });
      });
  } catch (error) {
    console.error("[hotelController.proxyImage] error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Получить отель по ID
 */
exports.getHotelById = async (req, res, next) => {
  try {
    const hotel = await hotelService.getHotelById(req.params.id);
    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Создать отель
 */
exports.createHotel = async (req, res, next) => {
  try {
    const hotelData = { ...req.body };

    // Если загружен файл, добавить путь к изображению
    if (req.file) {
      hotelData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const hotel = await hotelService.createHotel(hotelData);
    res.status(201).json({
      success: true,
      message: "Отель создан",
      data: hotel,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Обновить отель
 */
exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await hotelService.updateHotel(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Отель обновлен",
      data: hotel,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Удалить отель
 */
exports.deleteHotel = async (req, res, next) => {
  try {
    const result = await hotelService.deleteHotel(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Получить список городов
 */
exports.getCities = async (req, res, next) => {
  try {
    const cities = await hotelService.getCities();
    res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

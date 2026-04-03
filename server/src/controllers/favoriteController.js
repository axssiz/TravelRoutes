// server/src/controllers/favoriteController.js
const favoriteService = require("../services/favoriteService");

/**
 * Получить все избранные элементы
 */
exports.getFavorites = async (req, res, next) => {
  try {
    // Временно используем ID админа для тестирования
    const userId = 4;
    const favorites = await favoriteService.getUserFavorites(userId);
    res.status(200).json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Добавить отель в избранное
 */
exports.addHotelToFavorites = async (req, res, next) => {
  try {
    // Временно используем ID админа для тестирования
    const userId = 4;

    const { hotelId } = req.body;

    if (!hotelId) {
      return res.status(400).json({
        success: false,
        error: "hotelId обязателен",
      });
    }

    const favorite = await favoriteService.addHotelToFavorites(userId, hotelId);
    res.status(201).json({
      success: true,
      message: "Отель добавлен в избранное",
      data: favorite,
    });
  } catch (error) {
    const statusCode = error.message.includes("не найден") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Добавить маршрут в избранное
 */
exports.addRouteToFavorites = async (req, res, next) => {
  try {
    // Временно используем ID админа для тестирования
    const userId = 4;

    const { routeId } = req.body;

    if (!routeId) {
      return res.status(400).json({
        success: false,
        error: "routeId обязателен",
      });
    }

    const favorite = await favoriteService.addRouteToFavorites(userId, routeId);
    res.status(201).json({
      success: true,
      message: "Маршрут добавлен в избранное",
      data: favorite,
    });
  } catch (error) {
    const statusCode = error.message.includes("не найден") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Удалить из избранного
 */
exports.removeFromFavorites = async (req, res, next) => {
  try {
    // Временно используем ID админа для тестирования
    const userId = 4;

    const result = await favoriteService.removeFromFavorites(
      userId,
      req.params.id,
    );
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Проверить, находится ли элемент в избранном
 */
exports.isFavorite = async (req, res, next) => {
  try {
    // Временно используем ID админа для тестирования
    const userId = 4;

    const { hotelId, routeId } = req.query;
    const isFav = await favoriteService.isFavorite(userId, hotelId, routeId);
    res.status(200).json({
      success: true,
      data: { isFavorite: isFav },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

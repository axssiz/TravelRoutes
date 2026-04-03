// server/src/controllers/authController.js
const authService = require("../services/authService");

/**
 * Регистрация
 */
exports.register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Регистрация успешна",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Вход
 */
exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: "Вход успешен",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Получить профиль
 */
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await authService.getProfile(userId);
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Обновить профиль
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await authService.updateProfile(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Профиль обновлен",
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

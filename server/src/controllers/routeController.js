// server/src/controllers/routeController.js
const routeService = require("../services/routeService");

/**
 * Получить маршруты пользователя
 */
exports.getUserRoutes = async (req, res, next) => {
  try {
    const result = await routeService.getUserRoutes(
      req.user.id,
      req.query.page,
      req.query.limit,
    );
    res.status(200).json({
      success: true,
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
 * Получить маршрут по ID
 */
exports.getRouteById = async (req, res, next) => {
  try {
    const route = await routeService.getRouteById(req.params.id);
    res.status(200).json({
      success: true,
      data: route,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Создать маршрут
 */
exports.createRoute = async (req, res, next) => {
  try {
    const route = await routeService.createRoute(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Маршрут создан",
      data: route,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Обновить маршрут
 */
exports.updateRoute = async (req, res, next) => {
  try {
    const route = await routeService.updateRoute(
      req.params.id,
      req.user.id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Маршрут обновлен",
      data: route,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Удалить маршрут
 */
exports.deleteRoute = async (req, res, next) => {
  try {
    const result = await routeService.deleteRoute(req.params.id, req.user.id);
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
 * Получить все маршруты (для админ панели)
 */
exports.getAllRoutes = async (req, res, next) => {
  try {
    const result = await routeService.getAllRoutes(
      req.query.page,
      req.query.limit,
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.searchRoute = async (req, res, next) => {
  try {
    const { origin, destination } = req.query;
    const plan = await routeService.getRoutePlan(origin, destination);
    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

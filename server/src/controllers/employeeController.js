// server/src/controllers/employeeController.js
const employeeService = require("../services/employeeService");

/**
 * Создать отель
 */
exports.createHotel = async (req, res) => {
  try {
    const hotel = await employeeService.createHotel(req.body);
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
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await employeeService.updateHotel(req.params.id, req.body);
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

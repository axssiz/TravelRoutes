// server/src/routes/employeeRoutes.js
const express = require("express");
const employeeController = require("../controllers/employeeController");
const { authenticateToken, employeeOnly } = require("../middleware/auth");

const router = express.Router();

/**
 * Все роуты требуют доступа работника
 */
router.use(authenticateToken, employeeOnly);

// Отели
router.post("/hotels", employeeController.createHotel);
router.put("/hotels/:id", employeeController.updateHotel);

module.exports = router;

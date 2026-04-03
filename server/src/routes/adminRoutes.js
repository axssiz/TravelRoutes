// server/src/routes/adminRoutes.js
const express = require("express");
const adminController = require("../controllers/adminController");
const { authenticateToken, adminOnly } = require("../middleware/auth");

const router = express.Router();

/**
 * Все роуты требуют администраторского доступа
 */
router.use(authenticateToken, adminOnly);

// Статистика
router.get("/stats", adminController.getStats);

// Пользователи
router.get("/users", adminController.getAllUsers);
router.put("/users/:userId/role", adminController.updateUserRole);
router.delete("/users/:userId", adminController.deleteUser);

module.exports = router;

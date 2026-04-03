// server/src/routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

/**
 * Публичные роуты
 */
router.post("/register", authController.register);
router.post("/login", authController.login);

/**
 * Защищенные роуты
 */
router.get("/profile", authenticateToken, authController.getProfile);
router.put("/profile", authenticateToken, authController.updateProfile);

module.exports = router;

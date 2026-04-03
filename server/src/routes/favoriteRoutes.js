// server/src/routes/favoriteRoutes.js
const express = require("express");
const favoriteController = require("../controllers/favoriteController");
// const { authenticateToken } = require("../middleware/auth"); // Временно отключено

const router = express.Router();

/**
 * Временно отключена аутентификация для тестирования
 */
router.get("/", favoriteController.getFavorites);
router.get("/check", favoriteController.isFavorite);
router.post("/hotel", favoriteController.addHotelToFavorites);
router.post("/route", favoriteController.addRouteToFavorites);
router.delete("/:id", favoriteController.removeFromFavorites);

module.exports = router;

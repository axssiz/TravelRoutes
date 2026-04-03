// server/src/routes/routeRoutes.js
const express = require("express");
const routeController = require("../controllers/routeController");
const { authenticateToken, adminOnly } = require("../middleware/auth");

const router = express.Router();

/**
 * Защищенные роуты для пользователей
 */
router.get("/my-routes", authenticateToken, routeController.getUserRoutes);
router.get("/search", routeController.searchRoute);
router.post("/", authenticateToken, routeController.createRoute);
router.get("/:id", authenticateToken, routeController.getRouteById);
router.put("/:id", authenticateToken, routeController.updateRoute);
router.delete("/:id", authenticateToken, routeController.deleteRoute);

/**
 * Роуты для администраторов
 */
router.get(
  "/admin/all-routes",
  authenticateToken,
  adminOnly,
  routeController.getAllRoutes,
);

module.exports = router;

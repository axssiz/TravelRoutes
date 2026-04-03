// server/src/routes/hotelRoutes.js
const express = require("express");
const hotelController = require("../controllers/hotelController");
const {
  authenticateToken,
  adminOnly,
  employeeOnly,
} = require("../middleware/auth");
const multer = require("multer");

const router = express.Router();

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/**
 * Публичные роуты
 */
router.get("/", hotelController.getHotels);
router.get("/cities", hotelController.getCities);
router.get("/:id", hotelController.getHotelById);
router.get("/image/proxy", hotelController.proxyImage);

/**
 * Защищенные роуты (для администраторов и работников)
 */
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "employee") {
      return next();
    }
    return res.status(403).json({ error: "Доступ запрещен" });
  },
  hotelController.createHotel,
);
router.put(
  "/:id",
  authenticateToken,
  (req, res, next) => {
    if (req.user.role === "admin" || req.user.role === "employee") {
      return next();
    }
    return res.status(403).json({ error: "Доступ запрещен" });
  },
  hotelController.updateHotel,
);
router.delete(
  "/:id",
  authenticateToken,
  adminOnly,
  hotelController.deleteHotel,
);

module.exports = router;

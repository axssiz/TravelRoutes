// server/src/controllers/adminController.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Получить статистику администратора
 */
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalHotels = await prisma.hotel.count();
    const totalRoutes = await prisma.route.count();
    const totalFavorites = await prisma.favorite.count();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalHotels,
        totalRoutes,
        totalFavorites,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Получить всех пользователей
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Изменить роль пользователя
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Валидация роли
    const validRoles = ["user", "employee", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Недопустимая роль",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Пользователь не найден",
      });
    }

    // Нельзя изменить роль самого себя
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: "Нельзя изменить свою собственную роль",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      message: "Роль пользователя обновлена",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Удалить пользователя
 */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Пользователь не найден",
      });
    }

    // Нельзя удалить самого себя
    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: "Нельзя удалить свою собственную учетную запись",
      });
    }

    await prisma.user.delete({
      where: { id: parseInt(userId) },
    });

    res.json({
      success: true,
      message: "Пользователь удален",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

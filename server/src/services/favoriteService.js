// server/src/services/favoriteService.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Сервис для работы с избранным
 */
class FavoriteService {
  /**
   * Получить все избранные элементы пользователя
   */
  async getUserFavorites(userId) {
    const favorites = await prisma.favorite.findMany({
      where: { userId: parseInt(userId) },
      include: {
        hotel: true,
        route: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return favorites;
  }

  /**
   * Добавить отель в избранное
   */
  async addHotelToFavorites(userId, hotelId) {
    // Проверить автентификацию
    if (!userId) {
      throw new Error("Пользователь не авторизован");
    }

    // Проверить существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    // Проверить существование отеля
    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(hotelId) },
    });

    if (!hotel) {
      throw new Error("Отель не найден");
    }

    // Проверить, не добавлен ли уже
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: parseInt(userId),
        hotelId: parseInt(hotelId),
      },
    });

    if (existing) {
      throw new Error("Отель уже в избранном");
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: parseInt(userId),
        hotelId: parseInt(hotelId),
      },
      include: { hotel: true },
    });

    return favorite;
  }

  /**
   * Добавить маршрут в избранное
   */
  async addRouteToFavorites(userId, routeId) {
    // Проверить аутентификацию
    if (!userId) {
      throw new Error("Пользователь не авторизован");
    }

    // Проверить существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    // Проверить существование маршрута
    const route = await prisma.route.findUnique({
      where: { id: parseInt(routeId) },
    });

    if (!route) {
      throw new Error("Маршрут не найден");
    }

    // Проверить, не добавлен ли уже
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: parseInt(userId),
        routeId: parseInt(routeId),
      },
    });

    if (existing) {
      throw new Error("Маршрут уже в избранном");
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: parseInt(userId),
        routeId: parseInt(routeId),
      },
      include: { route: true },
    });

    return favorite;
  }

  /**
   * Удалить из избранного
   */
  async removeFromFavorites(userId, favoriteId) {
    const favorite = await prisma.favorite.findUnique({
      where: { id: parseInt(favoriteId) },
    });

    if (!favorite) {
      throw new Error("Избранное не найдено");
    }

    if (favorite.userId !== parseInt(userId)) {
      throw new Error("Нет доступа");
    }

    await prisma.favorite.delete({
      where: { id: parseInt(favoriteId) },
    });

    return { message: "Удалено из избранного" };
  }

  /**
   * Проверить, находится ли элемент в избранном
   */
  async isFavorite(userId, hotelId = null, routeId = null) {
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: parseInt(userId),
        hotelId: hotelId ? parseInt(hotelId) : undefined,
        routeId: routeId ? parseInt(routeId) : undefined,
      },
    });

    return !!favorite;
  }
}

module.exports = new FavoriteService();

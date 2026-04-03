// server/src/services/hotelService.js
const { PrismaClient } = require("@prisma/client");
const validators = require("../utils/validators");

const prisma = new PrismaClient();

/**
 * Сервис для работы с отелями
 */
class HotelService {
  /**
   * Получить все отели с фильтрами
   */
  async getHotels(filters = {}) {
    const {
      city,
      minPrice,
      maxPrice,
      minRating,
      page = 1,
      limit = 10,
    } = filters;

    const where = {};

    if (city && city.trim().length > 0) {
      where.city = city.trim();
    }

    const toNumber = (value) => {
      if (value === undefined || value === null || value === "") {
        return undefined;
      }
      const num = Number(value);
      return Number.isFinite(num) ? num : undefined;
    };

    const minPriceValue = toNumber(minPrice);
    const maxPriceValue = toNumber(maxPrice);
    const minRatingValue = toNumber(minRating);

    if (minPriceValue !== undefined || maxPriceValue !== undefined) {
      where.price = {};
      if (minPriceValue !== undefined) {
        where.price.gte = minPriceValue;
      }
      if (maxPriceValue !== undefined) {
        where.price.lte = maxPriceValue;
      }
    }

    if (minRatingValue !== undefined) {
      where.rating = {
        gte: minRatingValue,
      };
    }

    console.debug("[HotelService.getHotels] filters:", filters);
    console.debug("[HotelService.getHotels] where:", where);

    const pageValue =
      toNumber(page) !== undefined &&
      Number.isInteger(toNumber(page)) &&
      toNumber(page) > 0
        ? toNumber(page)
        : 1;
    const limitValue =
      toNumber(limit) !== undefined &&
      Number.isInteger(toNumber(limit)) &&
      toNumber(limit) > 0
        ? toNumber(limit)
        : 10;
    const skip = (pageValue - 1) * limitValue;

    let hotels;
    let total;
    try {
      hotels = await prisma.hotel.findMany({
        where,
        skip,
        take: limitValue,
        orderBy: { createdAt: "desc" },
      });

      total = await prisma.hotel.count({ where });
    } catch (err) {
      console.error("[HotelService.getHotels] Prisma error", err);
      throw new Error("Ошибка при получении отелей");
    }

    return {
      hotels,
      pagination: {
        page: pageValue,
        limit: limitValue,
        total,
        pages: Math.ceil(total / limitValue),
      },
    };
  }

  /**
   * Получить отель по ID
   */
  async getHotelById(id) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(id) },
    });

    if (!hotel) {
      throw new Error("Отель не найден");
    }

    return hotel;
  }

  /**
   * Создать отель (только для администраторов)
   */
  async createHotel(data) {
    const { name, description, price, rating, city, imageUrl } = data;

    // Валидация
    if (!name || name.trim().length === 0) {
      throw new Error("Название отеля обязательно");
    }

    if (!description || description.trim().length === 0) {
      throw new Error("Описание отеля обязательно");
    }

    if (!validators.validatePrice(price)) {
      throw new Error("Неверная цена");
    }

    if (rating !== undefined && !validators.validateRating(rating)) {
      throw new Error("Рейтинг должен быть от 0 до 5");
    }

    if (!city || city.trim().length === 0) {
      throw new Error("Город обязателен");
    }

    const hotel = await prisma.hotel.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        rating: rating ? parseFloat(rating) : 0,
        city: city.trim(),
        imageUrl: imageUrl || "https://via.placeholder.com/300x200",
      },
    });

    return hotel;
  }

  /**
   * Обновить отель
   */
  async updateHotel(id, data) {
    const { name, description, price, rating, city, imageUrl } = data;

    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(id) },
    });

    if (!hotel) {
      throw new Error("Отель не найден");
    }

    const updateData = {};

    if (name) {
      updateData.name = name.trim();
    }

    if (description) {
      updateData.description = description.trim();
    }

    if (price !== undefined && validators.validatePrice(price)) {
      updateData.price = parseFloat(price);
    }

    if (rating !== undefined && validators.validateRating(rating)) {
      updateData.rating = parseFloat(rating);
    }

    if (city) {
      updateData.city = city.trim();
    }

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const updatedHotel = await prisma.hotel.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return updatedHotel;
  }

  /**
   * Удалить отель
   */
  async deleteHotel(id) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(id) },
    });

    if (!hotel) {
      throw new Error("Отель не найден");
    }

    // Удалить все избранные связанные с этим отелем
    await prisma.favorite.deleteMany({
      where: { hotelId: parseInt(id) },
    });

    await prisma.hotel.delete({
      where: { id: parseInt(id) },
    });

    return { message: "Отель удален успешно" };
  }

  /**
   * Получить города (для фильтров)
   */
  async getCities() {
    const cities = await prisma.hotel.findMany({
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    });

    return cities.map((c) => c.city);
  }
}

module.exports = new HotelService();

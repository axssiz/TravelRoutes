// server/src/services/employeeService.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Сервис для работников
 */
class EmployeeService {
  /**
   * Создать отель
   */
  async createHotel(data) {
    const {
      name,
      description,
      price,
      rating,
      city,
      imageUrl,
      latitude,
      longitude,
    } = data;

    if (!name || !description || !price || !city) {
      throw new Error("Все поля обязательны");
    }

    const hotel = await prisma.hotel.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        rating: rating ? parseFloat(rating) : 0,
        city,
        imageUrl: imageUrl || "",
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
      },
    });

    return hotel;
  }

  /**
   * Обновить отель
   */
  async updateHotel(id, data) {
    const hotel = await prisma.hotel.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        price: data.price ? parseFloat(data.price) : undefined,
        rating: data.rating ? parseFloat(data.rating) : undefined,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
      },
    });

    return hotel;
  }
}

module.exports = new EmployeeService();

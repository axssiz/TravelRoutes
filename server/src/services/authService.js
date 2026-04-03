// server/src/services/authService.js
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../utils/jwt");
const validators = require("../utils/validators");

const prisma = new PrismaClient();

/**
 * Сервис аутентификации
 */
class AuthService {
  /**
   * Регистрация пользователя
   */
  async register(data) {
    const { name, email, phone, password } = data;

    // Валидация входных данных
    if (!email || !validators.validateEmail(email)) {
      throw new Error("Неверный email");
    }

    if (!password || !validators.validatePassword(password)) {
      throw new Error("Пароль должен быть минимум 6 символов");
    }

    if (!phone || !validators.validatePhone(phone)) {
      throw new Error("Неверный номер телефона");
    }

    if (!name || name.trim().length === 0) {
      throw new Error("Имя обязательно");
    }

    // Проверка существования пользователя
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new Error(
        "Пользователь с таким email или телефоном уже существует",
      );
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Вход пользователя
   */
  async login(data) {
    const { email, password } = data;

    if (!email || !validators.validateEmail(email)) {
      throw new Error("Неверный email");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Неверный пароль");
    }

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Получение профиля пользователя
   */
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  /**
   * Обновление профиля
   */
  async updateProfile(userId, data) {
    const { name, email } = data;

    const updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (email && validators.validateEmail(email)) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new Error("Email уже используется");
      }

      updateData.email = email;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  }
}

module.exports = new AuthService();

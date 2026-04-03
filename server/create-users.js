// create-users.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createUsers() {
  try {
    // Хеширование паролей
    const adminPassword = await bcrypt.hash("admin123", 10);
    const employeePassword = await bcrypt.hash("employee123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    // Создание пользователей
    const admin = await prisma.user.create({
      data: {
        name: "Администратор",
        email: "admin@example.com",
        phone: "+77001234567",
        password: adminPassword,
        role: "ADMIN",
      },
    });

    const employee = await prisma.user.create({
      data: {
        name: "Работник",
        email: "employee@example.com",
        phone: "+77007654321",
        password: employeePassword,
        role: "EMPLOYEE",
      },
    });

    const user = await prisma.user.create({
      data: {
        name: "Клиент",
        email: "user@example.com",
        phone: "+77009876543",
        password: userPassword,
        role: "USER",
      },
    });

    console.log("Пользователи созданы:");
    console.log("Админ:", admin.email, "Пароль: admin123");
    console.log("Работник:", employee.email, "Пароль: employee123");
    console.log("Клиент:", user.email, "Пароль: user123");
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();

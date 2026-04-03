// create-employee.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createEmployee() {
  try {
    // Хеширование пароля
    const employeePassword = await bcrypt.hash("worker123", 10);

    // Создание работника
    const employee = await prisma.user.create({
      data: {
        name: "Работник Алексей",
        email: "worker2@example.com",
        phone: "+77002222222",
        password: employeePassword,
        role: "EMPLOYEE",
      },
    });

    console.log("Работник создан:");
    console.log("Имя:", employee.name);
    console.log("Email:", employee.email);
    console.log("Пароль: worker123");
    console.log("Роль:", employee.role);
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createEmployee();

// check-worker-role.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkWorkerRole() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "worker2@example.com" },
    });

    if (user) {
      console.log("Пользователь найден:");
      console.log("Имя:", user.name);
      console.log("Email:", user.email);
      console.log("Роль:", user.role);
      console.log("Роль в верхнем регистре:", user.role.toUpperCase());
      console.log("Роль в нижнем регистре:", user.role.toLowerCase());

      // Проверяем логику из AuthContext
      const isEmployee = user.role === "employee";
      console.log("isEmployee (проверка на 'employee'):", isEmployee);

      const isEmployeeUpper = user.role === "EMPLOYEE";
      console.log("isEmployee (проверка на 'EMPLOYEE'):", isEmployeeUpper);
    } else {
      console.log("Пользователь не найден");
    }
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWorkerRole();

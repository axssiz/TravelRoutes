// check-users-detailed.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        role: true,
      },
    });

    console.log("Все пользователи в базе данных:");
    users.forEach((user) => {
      console.log(`${user.name} - ${user.email} - ${user.role}`);
    });

    const employee = users.find(
      (u) => u.role === "EMPLOYEE" || u.role === "employee",
    );
    if (employee) {
      console.log(`\nРаботник найден: ${employee.name} (${employee.email})`);
    } else {
      console.log("\nРаботник не найден в базе данных");
    }
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();

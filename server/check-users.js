const { PrismaClient } = require("@prisma/client");

async function checkUsers() {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany();
    console.log("Users in DB:", users.length);
    users.forEach((u) => console.log(`${u.email} - ${u.role}`));
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();

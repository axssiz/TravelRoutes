const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function checkAdminPassword() {
  const prisma = new PrismaClient();
  try {
    const admin = await prisma.user.findFirst({
      where: { email: "admin@example.com" },
    });

    if (!admin) {
      console.log("Admin not found");
      return;
    }

    console.log("Admin found:", admin.email);
    console.log("Stored hash:", admin.password);

    const isValid = await bcrypt.compare("admin123", admin.password);
    console.log("Password admin123 valid:", isValid);
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminPassword();

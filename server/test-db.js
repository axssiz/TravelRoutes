const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("Testing database connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful!");
    console.log("Result:", result);

    // Try to get or create the database
    await prisma.$executeRaw`CREATE DATABASE IF NOT EXISTS travel_routes_db`;
    console.log("✅ Database exists or was created");
  } catch (error) {
    console.error("❌ Connection error:", error.message);
    console.error("Full error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

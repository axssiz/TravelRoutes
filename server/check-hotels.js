// check-hotels.js
const { PrismaClient } = require("@prisma/client");

async function checkHotels() {
  const prisma = new PrismaClient();

  try {
    const hotels = await prisma.hotel.findMany();
    console.log("Total hotels:", hotels.length);
    hotels.forEach((hotel) => {
      console.log(`- ${hotel.name} (${hotel.city}) - Rating: ${hotel.rating}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHotels();

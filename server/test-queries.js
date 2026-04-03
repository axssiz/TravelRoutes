const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log("🔍 Testing database queries...\n");

    // Test 1: Get all hotels
    const hotels = await prisma.hotel.findMany();
    console.log(`✅ Found ${hotels.length} hotels:`);
    hotels.forEach((h) => {
      console.log(`   - ${h.name} (${h.city}) - $${h.price}/night`);
    });

    // Test 2: Get admin user
    console.log("\n✅ Admin user:");
    const admin = await prisma.user.findUnique({
      where: { email: "admin@travel.com" },
    });
    if (admin) {
      console.log(`   - ${admin.email} (${admin.role})`);
    } else {
      console.log("   - Not found");
    }

    // Test 3: Get all cities
    const cities = await prisma.hotel.groupBy({
      by: ["city"],
      _count: {
        id: true,
      },
    });
    console.log("\n✅ Hotels by city:");
    cities.forEach((c) => {
      console.log(`   - ${c.city}: ${c._count.id} hotels`);
    });

    console.log("\n✅ Database is working correctly!");
  } catch (error) {
    console.error("❌ Database error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();

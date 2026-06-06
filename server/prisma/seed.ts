import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.vehicleType.createMany({
    data: [
      { id: "t-1", name: "Electric Car" },
      { id: "t-2", name: "Cargo Bike" },
    ],
    skipDuplicates: true,
  });
  console.log("Seeded vehicle types ✓");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
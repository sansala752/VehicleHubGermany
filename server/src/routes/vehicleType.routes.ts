import express from "express";
import { prisma } from "../config/prisma";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const types = await prisma.vehicleType.findMany();
    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vehicle types" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const types = await prisma.vehicleType.findMany({
      include: {
        vehicles: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: { vehicleType: true },
        },
        _count: { select: { vehicles: true } },
      },
    });

    const totalVehicles = await prisma.vehicle.count();

    const result = await Promise.all(
      types.map(async (t) => {
        const [available, sold, reserved, avgPrice] = await Promise.all([
          prisma.vehicle.count({ where: { vehicleTypeId: t.id, availability: "AVAILABLE" } }),
          prisma.vehicle.count({ where: { vehicleTypeId: t.id, availability: "SOLD" } }),
          prisma.vehicle.count({ where: { vehicleTypeId: t.id, availability: "RESERVED" } }),
          prisma.vehicle.aggregate({
            where: { vehicleTypeId: t.id },
            _avg: { price: true },
          }),
        ]);

        return {
          id: t.id,
          name: t.name,
          total: t._count.vehicles,
          available,
          sold,
          reserved,
          avgPrice: avgPrice._avg.price ?? 0,
          totalVehicles,
          recentVehicles: t.vehicles,
        };
      })
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vehicle type stats" });
  }
});

export default router;
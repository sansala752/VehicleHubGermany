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

export default router;
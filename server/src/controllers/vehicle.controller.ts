import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { VehicleStatus } from "@prisma/client";

const STATUS_MAP: Record<string, VehicleStatus> = {
  Available: VehicleStatus.AVAILABLE,
  Sold: VehicleStatus.SOLD,
  Reserved: VehicleStatus.RESERVED,
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const { name, manufacturer, year, price, status, imageUrl, vehicleTypeId } = req.body;

    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        manufacturer,
        year: Number(year),
        price: Number(price),
        availability: STATUS_MAP[status] ?? VehicleStatus.AVAILABLE,
        imageUrl,
        vehicleTypeId,
      },
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating vehicle" });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { vehicleType: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vehicles" });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.vehicle.delete({ where: { id } });
    res.json({ message: "Vehicle deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting vehicle" });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, manufacturer, year, price, status, imageUrl, vehicleTypeId } = req.body;

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        name,
        manufacturer,
        year: Number(year),
        price: Number(price),
        availability: STATUS_MAP[status] ?? VehicleStatus.AVAILABLE,
        imageUrl,
        vehicleTypeId,
      },
    });

    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating vehicle" });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { vehicleType: true },
    });
    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
      return;
    }
    res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching vehicle" });
  }
};
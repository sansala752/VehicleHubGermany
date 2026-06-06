import express from "express";
import { createVehicle, getVehicles, deleteVehicle, updateVehicle, getVehicleById,getStats } from "../controllers/vehicle.controller";

const router = express.Router();

router.get("/stats", getStats);
router.get("/", getVehicles);
router.post("/", createVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);
router.get("/:id", getVehicleById);


export default router;
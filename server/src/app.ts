import express from "express";
import cors from "cors";
import uploadRouter from "./routes/upload.routes";
import vehicleRouter from "./routes/vehicle.routes";
import vehicleTypeRouter from "./routes/vehicleType.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

app.use("/api/vehicles", vehicleRouter);
app.use("/upload", uploadRouter);
app.use("/api/vehicle-types", vehicleTypeRouter);

export default app;
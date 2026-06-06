import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => {
  res.json({
    success: true,
    message: "VehicleHub API running",
  });
});

export default app;
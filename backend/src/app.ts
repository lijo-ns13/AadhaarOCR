import express, { Application } from "express";
import cors from "cors";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// router
import ocrRoutes from "./routes/ocr.routes";
dotenv.config();

const app: Application = express();

const corsOption = {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOption));

app.use("/", ocrRoutes);

export default app;

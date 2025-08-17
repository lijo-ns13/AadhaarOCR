import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";

export const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("mongodb connection string is missing");
    }
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.dbName || "boarding-weektwo",
    });
    console.log("mongodb connected successfully");
  } catch (error) {
    console.log("failed to connect mongodb");
    process.exit(1);
  }
};

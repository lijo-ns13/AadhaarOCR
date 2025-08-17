"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || "";
const connectDB = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error("mongodb connection string is missing");
        }
        await mongoose_1.default.connect(MONGODB_URI, {
            dbName: process.env.dbName || "boarding-weektwo",
        });
        console.log("mongodb connected successfully");
    }
    catch (error) {
        console.log("failed to connect mongodb");
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=databaseConfig.js.map
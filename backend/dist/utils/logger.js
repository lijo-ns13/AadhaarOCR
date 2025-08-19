"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logDirectory = path_1.default.join(__dirname, "../../logs");
// Make sure log directory exists
if (!fs_1.default.existsSync(logDirectory)) {
    fs_1.default.mkdirSync(logDirectory, { recursive: true });
}
// File transport with rotation
const fileTransport = new winston_daily_rotate_file_1.default({
    filename: "app-%DATE%.log",
    dirname: logDirectory,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
});
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), // Capture error stacks
    winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message, stack }) => {
        return `[${timestamp}] ${level}: ${stack || message}`;
    })),
    transports: [
        fileTransport,
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: "HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] ${level}: ${message}`;
            })),
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map
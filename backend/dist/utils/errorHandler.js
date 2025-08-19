"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleControllerError = handleControllerError;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const httpStatus_1 = require("../constants/httpStatus");
function handleControllerError(error, res, context) {
    const logPrefix = context ? `[${context}]` : "[ErrorHandler]";
    // ✅ Zod error
    if (error instanceof zod_1.ZodError) {
        const errors = Object.fromEntries(error.errors.map((e) => [e.path.join("."), e.message]));
        logger_1.default.warn(`${logPrefix} Zod validation failed`, { errors });
        res.status(httpStatus_1.HTTP_STATUS_CODES.BAD_REQUEST).json({
            success: false,
            errors,
        });
        return;
    }
    // ✅ Mongoose validation error
    if (error instanceof mongoose_1.default.Error.ValidationError) {
        const errors = {};
        for (const [field, errObj] of Object.entries(error.errors)) {
            errors[field] = errObj.message;
        }
        logger_1.default.warn(`${logPrefix} Mongoose validation failed`, { errors });
        res.status(httpStatus_1.HTTP_STATUS_CODES.BAD_REQUEST).json({
            success: false,
            errors,
        });
        return;
    }
    // ✅ MongoDB duplicate key error
    if (isMongoDuplicateKeyError(error)) {
        const field = Object.keys(error.keyPattern)[0];
        const value = error.keyValue?.[field];
        logger_1.default.warn(`${logPrefix} Duplicate key error`, { field, value });
        res.status(httpStatus_1.HTTP_STATUS_CODES.CONFLICT).json({
            success: false,
            message: `${field} already exists`,
        });
        return;
    }
    // ❌ Unknown or unhandled error
    logger_1.default.error(`${logPrefix} Unexpected error`, error);
    res.status(httpStatus_1.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
    });
}
// ✅ Narrow type-check helper
function isMongoDuplicateKeyError(err) {
    return (typeof err === "object" &&
        err !== null &&
        "code" in err &&
        err.code === 11000 &&
        "keyPattern" in err &&
        "keyValue" in err);
}
//# sourceMappingURL=errorHandler.js.map
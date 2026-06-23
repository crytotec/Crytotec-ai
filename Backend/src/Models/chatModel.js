"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    chatId: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "ai"],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
exports.Message = mongoose_1.default.model("Message", messageSchema);

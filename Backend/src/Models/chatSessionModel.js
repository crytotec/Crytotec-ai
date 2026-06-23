"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    chatId: { type: String, required: true, unique: true },
    title: { type: String, default: "New Chat" },
}, { timestamps: true });
exports.Chat = mongoose_1.default.model("Chat", chatSchema);

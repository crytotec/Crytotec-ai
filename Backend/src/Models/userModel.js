"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const mongoose_1 = __importDefault(require("mongoose"));
const chatAiSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        default: crypto_1.randomUUID
    },
    role: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    chatAi: [chatAiSchema]
});
exports.default = mongoose_1.default.model("User", userSchema);

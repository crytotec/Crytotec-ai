"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRouter = void 0;
const express_1 = __importDefault(require("express"));
const ChatController_1 = require("../Controllers/ChatController");
const Token_maniger_1 = require("../utilis/Token-maniger");
exports.ChatRouter = express_1.default.Router();
exports.ChatRouter.post("/user", Token_maniger_1.verifyToken, ChatController_1.chatWithAi);
exports.ChatRouter.get("/Recent", Token_maniger_1.verifyToken, ChatController_1.Recent);
exports.ChatRouter.get("/:chatId", Token_maniger_1.verifyToken, ChatController_1.getChat);
exports.ChatRouter.delete("/:chatId", Token_maniger_1.verifyToken, ChatController_1.deleteChat);

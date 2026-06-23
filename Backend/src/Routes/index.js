"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllRouter = void 0;
const express_1 = __importDefault(require("express"));
const UserRouter_1 = require("./UserRouter");
const ChatRouter_1 = require("./ChatRouter");
exports.AllRouter = express_1.default.Router();
exports.AllRouter.use('/user', UserRouter_1.userRouter);
exports.AllRouter.use('/chat', ChatRouter_1.ChatRouter);

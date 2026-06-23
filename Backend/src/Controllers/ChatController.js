"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChat = exports.getChat = exports.Recent = exports.chatWithAi = void 0;
const Config_1 = require("../Configuration/Config");
const chatModel_1 = require("../Models/chatModel");
const chatSessionModel_1 = require("../Models/chatSessionModel"); // ✅ import Chat model
const crypto_1 = __importDefault(require("crypto"));
const chatWithAi = async (req, res) => {
    try {
        const { message, chatId } = req.body;
        const userId = req.user?.id;
        if (!message) {
            return res.status(400).json({ message: "message is required" });
        }
        const isNewChat = !chatId; // ✅ check if this is a new conversation
        const finalChatId = chatId || crypto_1.default.randomUUID();
        const response = await Config_1.ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `
Respond in clean Markdown:
- headings
- bullet points
- clear formatting

user message: ${message}
              `,
                        },
                    ],
                },
            ],
        });
        const reply = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
        await chatModel_1.Message.create({
            userId,
            chatId: finalChatId,
            role: "user",
            message,
        });
        await chatModel_1.Message.create({
            userId,
            chatId: finalChatId,
            role: "ai",
            message: reply,
        });
        // ✅ Only create a Chat session on the FIRST message
        if (isNewChat) {
            await chatSessionModel_1.Chat.create({
                userId,
                chatId: finalChatId,
                title: message.slice(0, 40), // first 40 chars become the title
            });
        }
        return res.status(200).json({
            success: true,
            reply,
            chatId: finalChatId, // ✅ always return chatId to frontend
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "AI error or server issue",
        });
    }
};
exports.chatWithAi = chatWithAi;
const Recent = async (req, res) => {
    try {
        const userId = req.user?.id;
        const chats = await chatSessionModel_1.Chat.find({ userId }) // ✅ now uses Chat model correctly
            .sort({ updatedAt: -1 });
        return res.status(200).json({
            success: true,
            chats,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load recent chats",
        });
    }
};
exports.Recent = Recent;
// add this to your chatController.ts
const getChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user?.id;
        const messages = await chatModel_1.Message.find({ chatId, userId })
            .sort({ createdAt: 1 }); // ✅ oldest first so chat reads top to bottom
        return res.status(200).json({
            success: true,
            messages,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load chat",
        });
    }
};
exports.getChat = getChat;
const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user?.id;
        await chatSessionModel_1.Chat.deleteOne({ chatId, userId });
        await chatModel_1.Message.deleteMany({ chatId, userId });
        return res.status(200).json({ success: true, message: "Chat deleted" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to delete chat" });
    }
};
exports.deleteChat = deleteChat;

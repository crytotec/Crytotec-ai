import express  from "express"
import { chatWithAi, Recent, getChat, deleteChat } from "../Controllers/ChatController"
import { verifyToken } from "../utilis/Token-maniger"
export const ChatRouter=express.Router()


ChatRouter.post("/user",verifyToken, chatWithAi)
ChatRouter.get("/Recent",verifyToken, Recent)
ChatRouter.get("/:chatId", verifyToken, getChat);
ChatRouter.delete("/:chatId", verifyToken, deleteChat) 
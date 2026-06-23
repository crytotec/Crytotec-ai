import { Request, Response } from "express";
import { ai } from "../Configuration/Config";
import { Message } from "../Models/chatModel";
import { Chat } from "../Models/chatSessionModel"; // ✅ import Chat model
import crypto from "crypto";

export const chatWithAi = async (req: Request, res: Response) => {
  try {
    const { message, chatId } = req.body;

    const userId = req.user?.id;

    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const isNewChat = !chatId; // ✅ check if this is a new conversation
    const finalChatId = chatId || crypto.randomUUID();

    const response = await ai.models.generateContent({
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

    await Message.create({
      userId,
      chatId: finalChatId,
      role: "user",
      message,
    });

    await Message.create({
      userId,
      chatId: finalChatId,
      role: "ai",
      message: reply,
    });

    // ✅ Only create a Chat session on the FIRST message
    if (isNewChat) {
      await Chat.create({
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
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "AI error or server issue",
    });
  }
};

export const Recent = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const chats = await Chat.find({ userId }) // ✅ now uses Chat model correctly
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load recent chats",
    });
  }
};

// add this to your chatController.ts
export const getChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id;

    const messages = await Message.find({ chatId, userId })
      .sort({ createdAt: 1 }); // ✅ oldest first so chat reads top to bottom

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load chat",
    });
  }
};



export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id;

    await Chat.deleteOne({ chatId, userId });
    await Message.deleteMany({ chatId, userId });

    return res.status(200).json({ success: true, message: "Chat deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Failed to delete chat" });
  }
};
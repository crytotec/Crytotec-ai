import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    chatId: { type: String, required: true, unique: true },
    title: { type: String, default: "New Chat" },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
import { useState, type FormEvent, useEffect, useRef } from "react";
import { sendMessage, getChatMessages } from "../connector/connection-to-dB";
import ReactMarkdown from "react-markdown";
import { useRecent } from "../context/Recentcontext";

type ChatMessage = {
  role: "user" | "ai";
  message: string;
};

const Chat = () => {
  const [newmessage, setNewmessage] = useState<ChatMessage[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const { selectedChat, getRecent, newChatTrigger } = useRecent();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [newmessage]);

  useEffect(() => {
    setNewmessage([]);
    setCurrentChatId(null);
  }, [newChatTrigger]);

  useEffect(() => {
    const loadChat = async () => {
      if (!selectedChat) return;
      try {
        const data = await getChatMessages(selectedChat);
        setNewmessage(data.messages || []);
        setCurrentChatId(selectedChat);
      } catch (error) {
        console.log("Failed to load chat:", error);
      }
    };
    loadChat();
  }, [selectedChat]);

  const updatemessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);
    const message = formdata.get("message") as string;
    if (!message.trim()) return;

    setNewmessage((prev) => [...prev, { role: "user", message }]);
    e.currentTarget.reset();
    setLoading(true);

    try {
      const res = await sendMessage(message, currentChatId);

      if (!currentChatId && res.chatId) {
        setCurrentChatId(res.chatId);
        await getRecent();
      }

      setNewmessage((prev) => [...prev, { role: "ai", message: res.reply }]);
    } catch (error: any) {
      const msg = error?.message || "Error: AI not responding";
      setNewmessage((prev) => [
        ...prev,
        { role: "ai", message: `⚠️ ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center bg-gray-100">
      <div className="w-full max-w-3xl flex flex-col h-full">

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4 chat-scroll">

          {newmessage.length === 0 && !loading && (
            <div className="h-full flex items-center justify-center text-gray-400 text-center">
              Select or start a conversation...
            </div>
          )}

          {newmessage.map((item, index) => (
            <div
              key={index}
              className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[85%] text-sm ${
                  item.role === "user"
                    ? "bg-gray-200 text-black"
                    : "bg-white text-black shadow-sm"
                }`}
              >
                <ReactMarkdown>{item.message}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-white text-black shadow-sm text-sm animate-pulse">
                Crytotec AI is thinking...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 bg-white border-t">
          <form onSubmit={updatemessage} className="flex gap-2">
            <input
              type="text"
              name="message"
              placeholder="Message Crytotec AI..."
              disabled={loading}
              className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-xl transition-colors"
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Chat;
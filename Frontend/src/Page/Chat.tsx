import { useState, type FormEvent, useEffect, useRef, useCallback } from "react";
import { sendMessage, getChatMessages } from "../connector/connection-to-dB";
import ReactMarkdown from "react-markdown";
import { useRecent } from "../context/Recentcontext";

type ChatMessage = {
  role: "user" | "ai";
  message: string;
};

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const { selectedChat, getRecent, newChatTrigger } = useRecent();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMessages([]);
    setCurrentChatId(null);
    setError(null);
  }, [newChatTrigger]);

  useEffect(() => {
    const loadChat = async () => {
      if (!selectedChat) return;
      try {
        const data = await getChatMessages(selectedChat);
        setMessages(data.messages || []);
        setCurrentChatId(selectedChat);
        setError(null);
      } catch (error) {
        console.log("Failed to load chat:", error);
      }
    };
    loadChat();
  }, [selectedChat]);

  const sendMsg = useCallback(async (message: string) => {
    setLastMessage(message);
    setMessages((prev) => [...prev, { role: "user", message }]);
    setLoading(true);
    setError(null);

    try {
      const res = await sendMessage(message, currentChatId);
      if (!currentChatId && res.chatId) {
        setCurrentChatId(res.chatId);
        await getRecent();
      }
      setMessages((prev) => [...prev, { role: "ai", message: res.reply }]);
    } catch (err: any) {
      setError(err?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentChatId, getRecent]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const message = formdata.get("message") as string;
    if (!message.trim()) return;
    e.currentTarget.reset();
    await sendMsg(message);
  };

  const handleRetry = () => {
    if (lastMessage) {
      // remove last failed user message before retrying
      setMessages((prev) => prev.slice(0, -1));
      setError(null);
      sendMsg(lastMessage);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">

        {messages.length === 0 && !loading && (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm text-center">
            Send a message to start chatting
          </div>
        )}

        {messages.map((item, index) => (
          <div
            key={index}
            className={`flex w-full ${item.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                item.role === "user"
                  ? "bg-blue-500 text-white rounded-br-sm max-w-[80%]"
                  : "bg-white text-gray-900 shadow-sm border border-gray-100 rounded-bl-sm max-w-[85%]"
              }`}
            >
              <ReactMarkdown>{item.message}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white shadow-sm border border-gray-100 text-sm text-gray-400 animate-pulse">
              Crytotec AI is thinking…
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ERROR BAR */}
      {error && (
        <div className="mx-4 mb-2 flex items-center justify-between gap-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <span>{error}</span>
          <button
            onClick={handleRetry}
            className="shrink-0 px-3 py-1 text-xs border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* INPUT BAR */}
      <div className="p-3 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            name="message"
            placeholder="Message Crytotec AI…"
            disabled={loading}
            className="flex-1 min-w-0 bg-gray-100 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white rounded-full transition-colors"
          >
            ↑
          </button>
        </form>
      </div>

    </div>
  );
};

export default Chat;
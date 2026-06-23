import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Recent } from "../connector/connection-to-dB";

type RecentType = {
  recent: any[];
  selectedChat: string | null;
  currentChatId: string | null;
  newChatTrigger: number;
  setSelectedChat: (id: string | null) => void;
  setCurrentChatId: (id: string | null) => void;
  getRecent: () => Promise<void>;
  resetChat: () => void;
};

const RecentContext = createContext<RecentType | null>(null);

export const RecentProvider = ({ children }: { children: ReactNode }) => {
  const [recent, setRecent] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [newChatTrigger, setNewChatTrigger] = useState(0); // ✅ forces Chat to clear

  const getRecent = async () => {
    try {
      const res = await Recent();
      setRecent(res.chats || res.messages || []);
    } catch (error) {
      console.log("Failed to fetch recent:", error);
    }
  };

  const resetChat = () => {
    setSelectedChat(null);
    setCurrentChatId(null);
    setNewChatTrigger((prev) => prev + 1); // ✅ triggers useEffect in Chat
  };

  return (
    <RecentContext.Provider
      value={{
        recent,
        selectedChat,
        currentChatId,
        newChatTrigger,
        setSelectedChat,
        setCurrentChatId,
        getRecent,
        resetChat,
      }}
    >
      {children}
    </RecentContext.Provider>
  );
};

export const useRecent = () => {
  const context = useContext(RecentContext);
  if (!context) throw new Error("useRecent must be used inside RecentProvider");
  return context;
};
import { Link } from "react-router-dom";
import { useAuth } from "../context/usercontext";
import openai from "../Images/openai.png";
import { FiSidebar } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { useRecent } from "../context/Recentcontext";
import { useEffect, useState } from "react";
import { deleteChatById } from "../connector/connection-to-dB";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Sidebar({ open, setOpen }: Props) {
  const user = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { recent, getRecent, setSelectedChat, resetChat } = useRecent();

  useEffect(() => {
    getRecent();
  }, []);

  const handleDelete = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setDeletingId(chatId);
    try {
      await deleteChatById(chatId);
      await getRecent();
      resetChat(); // ✅ clears chat if deleted one was open
    } catch (error) {
      console.log("Failed to delete:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col w-full p-3 bg-[#111827] text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={openai} className="invert w-6 h-6" />
          <h2 className="font-bold">crytotec ai</h2>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md text-white hover:bg-gray-700"
        >
          <FiSidebar size={22} />
        </button>
      </div>

      {/* NEW CHAT */}
      <button
        onClick={resetChat} // ✅ directly call resetChat
        className="mt-4 bg-[#1a1a9f] hover:bg-blue-500 rounded-md p-2 text-sm transition-colors"
      >
        + New Chat
      </button>

      {/* HISTORY */}
      <div className="flex-1 mt-4 overflow-y-auto space-y-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide px-2 mb-1">
          Recent
        </p>

        {recent && recent.length === 0 && (
          <p className="text-xs text-gray-500 px-2">No recent chats yet</p>
        )}

        {recent?.map((chat) => (
          <div
            key={chat.chatId}
            onClick={() => setSelectedChat(chat.chatId)}
            className="group flex items-center justify-between p-2 cursor-pointer text-sm rounded-md hover:bg-gray-700"
            title={chat.title}
          >
            <span className="truncate flex-1">
              {chat.title || "New Chat"}
            </span>

            <button
              onClick={(e) => handleDelete(e, chat.chatId)}
              disabled={deletingId === chat.chatId}
              className="ml-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              title="Delete chat"
            >
              {deletingId === chat.chatId ? (
                <span className="text-xs">...</span>
              ) : (
                <MdDeleteOutline size={16} />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* AUTH */}
      <div className="border-t border-gray-700 pt-3">
        {user && user.isLogged ? (
          <Link to="/logout" className="text-sm text-gray-300 hover:text-white">
            Logout
          </Link>
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        )}
      </div>

    </div>
  );
}

export default Sidebar;
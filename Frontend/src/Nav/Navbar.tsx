import { RxHamburgerMenu } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/usercontext";
import { useRecent } from "../context/Recentcontext";
import { deleteChatById } from "../connector/connection-to-dB";

function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const user = useAuth();
  const { recent, getRecent, setSelectedChat, resetChat } = useRecent();

  useEffect(() => {
    getRecent();
  }, []);

  const handleNewChat = () => {
    resetChat(); // ✅ clears everything
    setIsNavOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    setIsNavOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setDeletingId(chatId);
    try {
      await deleteChatById(chatId);
      await getRecent();
      resetChat();
    } catch (error) {
      console.log("Failed to delete:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative w-full p-4 sm:hidden bg-white border-b">

      {/* TOP BAR */}
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsNavOpen((prev) => !prev)}
            className="p-2 rounded-md hover:bg-gray-200 transition"
          >
            <RxHamburgerMenu className="w-5 h-5 text-black" />
          </button>
          <p className="text-black text-xl font-bold">Crytotec AI</p>
        </div>

        <button
          onClick={handleNewChat}
          className="bg-black text-white rounded-md px-4 py-2 text-sm"
        >
          + New
        </button>
      </div>

      {/* OVERLAY + DRAWER */}
      {isNavOpen && (
        <>
          <div
            onClick={() => setIsNavOpen(false)}
            className="fixed inset-0 bg-black/30 z-40"
          />

          <div className="fixed top-0 left-0 h-screen w-64 bg-[#111827] text-white shadow-lg z-50 flex flex-col p-4">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-lg">Crytotec AI</p>
              <button
                onClick={() => setIsNavOpen(false)}
                className="text-sm text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* NEW CHAT */}
            <button
              onClick={handleNewChat}
              className="bg-[#1a1a9f] hover:bg-blue-500 rounded-md p-2 text-sm transition-colors mb-4"
            >
              + New Chat
            </button>

            {/* RECENT CHATS */}
            <div className="flex-1 overflow-y-auto space-y-1">
              <p className="text-xs text-gray-400 uppercase tracking-wide px-2 mb-2">
                Recent
              </p>

              {recent && recent.length === 0 && (
                <p className="text-xs text-gray-500 px-2">No recent chats yet</p>
              )}

              {recent?.map((chat) => (
                <div
                  key={chat.chatId}
                  onClick={() => handleSelectChat(chat.chatId)}
                  className="flex items-center justify-between p-2 cursor-pointer text-sm rounded-md hover:bg-gray-700 group"
                  title={chat.title}
                >
                  <span className="truncate flex-1">
                    {chat.title || "New Chat"}
                  </span>

                  <button
                    onClick={(e) => handleDelete(e, chat.chatId)}
                    disabled={deletingId === chat.chatId}
                    className="ml-2 text-gray-400 hover:text-red-400 opacity-100 transition-opacity disabled:opacity-50 flex-shrink-0"
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
            <div className="border-t border-gray-700 pt-3 mt-2">
              {user?.isLogged ? (
                <Link
                  to="/logout"
                  onClick={() => setIsNavOpen(false)}
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Logout
                </Link>
              ) : (
                <div className="flex flex-col gap-2 text-sm">
                  <Link to="/login" onClick={() => setIsNavOpen(false)} className="text-gray-300 hover:text-white">Login</Link>
                  <Link to="/signup" onClick={() => setIsNavOpen(false)} className="text-gray-300 hover:text-white">Sign up</Link>
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;
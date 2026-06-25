import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Nav/Sidebar ";
import Navbar from "../../Nav/Navbar";
import { FiSidebar } from "react-icons/fi";
import openai from '../../Images/openai.png';
import { IoChatbubbleOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { useRecent } from "../../context/Recentcontext";
import { deleteChatById } from "../../connector/connection-to-dB";

function AppLayout() {
  const [open, setOpen] = useState(true);
  const [recentOpen, setRecentOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { recent, getRecent, setSelectedChat, resetChat } = useRecent();

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
    // ✅ FIXED: added overflow-hidden
    <div className="h-screen flex relative overflow-hidden">

      {/* SIDEBAR */}
      {/* ✅ FIXED: added flex-shrink-0 */}
      <div
        className={`hidden md:flex flex-shrink-0 bg-[#0b0b8b] text-white transition-all duration-300
        ${open ? "w-64" : "w-0 overflow-hidden"}`}
      >
        <Sidebar open={open} setOpen={setOpen} />
      </div>

      {/* COLLAPSED ICON BAR */}
      {!open && (
        // ✅ FIXED: added explicit w-14
        <div className="hidden md:flex absolute h-full bg-[#0b0b8b] p-4 flex-col items-center gap-4 z-30 w-14">

          <img src={openai} className="invert w-6 h-6" />

          <button
            onClick={() => { setOpen(true); setRecentOpen(false); }}
            className="group relative text-white p-2 rounded-md hover:bg-blue-700"
          >
            <FiSidebar size={22} className="cursor-pointer" />
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
              Open
            </span>
          </button>

          <button
            onClick={() => setRecentOpen((prev) => !prev)}
            className="group relative text-white p-2 rounded-md hover:bg-blue-700"
          >
            <IoChatbubbleOutline className="w-6 h-6 cursor-pointer" />
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
              Recent
            </span>
          </button>

        </div>
      )}

      {/* RECENT POPOUT DRAWER */}
      {!open && recentOpen && (
        <>
          <div
            onClick={() => setRecentOpen(false)}
            className="fixed inset-0 bg-black/20 z-20"
          />

          {/* ✅ FIXED: left-16 → left-14 to match icon bar width */}
          <div className="fixed top-0 left-14 h-full w-60 bg-[#111827] text-white z-30 flex flex-col p-4 shadow-xl">

            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Recent</p>
              <button
                onClick={() => setRecentOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <button
              onClick={() => { resetChat(); setRecentOpen(false); }}
              className="bg-[#1a1a9f] hover:bg-blue-500 rounded-md p-2 text-sm transition-colors mb-4"
            >
              + New Chat
            </button>

            <div className="flex-1 overflow-y-auto space-y-1 chat-scroll">
              {recent && recent.length === 0 && (
                <p className="text-xs text-gray-500 px-2">No recent chats yet</p>
              )}

              {recent?.map((chat) => (
                <div
                  key={chat.chatId}
                  onClick={() => { setSelectedChat(chat.chatId); setRecentOpen(false); }}
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

          </div>
        </>
      )}

      {/* MAIN CONTENT */}
      {/* ✅ FIXED: md:ml-14 when collapsed, min-h-0 min-w-0 to prevent overflow */}
      <div className={`flex-1 flex flex-col min-h-0 min-w-0 ${!open ? "md:ml-14" : ""}`}>
        <Navbar />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default AppLayout;
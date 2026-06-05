import { motion, AnimatePresence } from "motion/react";
import { PushPinIcon, DotsThreeIcon, TrashIcon } from "@phosphor-icons/react";

export default function ChatHistoryItem({
  chat,
  currentChat,
  activeDropdown,
  setActiveDropdown,
  loadChat,
  setIsOpen,
  togglePinChat,
  removeChat,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`group flex items-center justify-between px-3 py-1 rounded-xl cursor-pointer transition-colors ${
        currentChat?._id === chat._id
          ? "bg-primary/10 text-primary"
          : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-muted hover:text-foreground"
      }`}
      onClick={() => {
        loadChat(chat._id);
        if (window.innerWidth < 768) setIsOpen(false);
      }}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {chat.isPinned && (
            <PushPinIcon weight="fill" className="w-3.5 h-3.5 shrink-0 text-primary" />
          )}
          <span className="text-sm truncate font-medium">{chat.title}</span>
        </div>
      </div>
      <div className="relative shrink-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            setActiveDropdown(activeDropdown === chat._id ? null : chat._id);
          }}
          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 rounded transition-all cursor-pointer"
          title="Options"
        >
          <DotsThreeIcon weight="bold" className="w-5 h-5 text-muted hover:text-foreground" />
        </button>

        <AnimatePresence>
          {activeDropdown === chat._id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-40 bg-card border border-card-border rounded-xl shadow-lg overflow-hidden z-50 py-1"
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePinChat(chat._id, !chat.isPinned);
                  setActiveDropdown(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-left cursor-pointer"
              >
                <PushPinIcon className="w-4 h-4 text-muted" />
                {chat.isPinned ? "Unpin Chat" : "Pin to Top"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeChat(chat._id);
                  setActiveDropdown(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left cursor-pointer"
              >
                <TrashIcon className="w-4 h-4" />
                Delete Chat
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

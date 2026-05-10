"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShootingStarIcon,
  ChatCircle,
  SignOut,
  Sun,
  Moon,
  Desktop,
  Trash,
  Plus,
  List,
} from "@phosphor-icons/react";
import useAuth from "@/features/auth/useAuth";
import useChat from "@/features/chats/useChat";
import { useTheme } from "./ThemeProvider";
import { useEffect } from "react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarChats, currentChat, loadChat, clearCurrentChat, removeChat } =
    useChat();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  // Close sidebar by default on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, []);

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          width: isOpen ? 320 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        className="h-full bg-card border-r border-card-border flex flex-col shrink-0 overflow-hidden absolute md:relative z-40 left-0 top-0 bottom-0 shadow-2xl md:shadow-none"
      >
        <div className="w-[320px] h-full flex flex-col shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-card-border flex items-center justify-between">
            <button
              onClick={clearCurrentChat}
              className="flex-1 flex items-center justify-between p-3 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-xl transition-colors group mr-2 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg group-hover:scale-105 transition-transform">
                  <ShootingStarIcon
                    weight="fill"
                    className="text-white h-5 w-5"
                  />
                </div>
                <span className="font-medium text-foreground tracking-tight">
                  Echo.AI
                </span>
              </div>
              <Plus weight="bold" className="text-muted w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-muted hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-xl transition-colors shrink-0 cursor-pointer"
              title="Close Sidebar"
            >
              <List weight="bold" className="w-5 h-5" />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 px-2">
              Recent Chats
            </p>

            {sidebarChats.length === 0 ? (
              <p className="text-sm text-muted px-2 font-light">
                No conversations yet.
              </p>
            ) : (
              sidebarChats.map((chat) => (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
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
                    <ChatCircle
                      weight={
                        currentChat?._id === chat._id ? "fill" : "regular"
                      }
                      className="w-5 h-5 shrink-0"
                    />
                    <span className="text-sm truncate font-medium">
                      {chat.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChat(chat._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-all shrink-0 cursor-pointer"
                  >
                    <Trash className="w-4 h-4 text-red-400 hover:text-red-500" />
                  </button>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-card-border flex flex-col gap-3 shrink-0">
            {/* Theme Selector */}
            <div className="flex items-center justify-between p-1 bg-background rounded-xl border border-card-border shadow-sm">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all cursor-pointer ${
                  theme === "light"
                    ? "bg-card shadow-sm text-amber-500 border border-card-border"
                    : "text-muted hover:text-foreground border border-transparent"
                }`}
                title="Light Mode"
              >
                <Sun weight="duotone" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all mx-1 cursor-pointer ${
                  theme === "system"
                    ? "bg-card shadow-sm text-foreground border border-card-border"
                    : "text-muted hover:text-foreground border border-transparent"
                }`}
                title="System Theme"
              >
                <Desktop weight="duotone" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-card shadow-sm text-blue-400 border border-card-border"
                    : "text-muted hover:text-foreground border border-transparent"
                }`}
                title="Dark Mode"
              >
                <Moon weight="duotone" className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-card-border">
              <div className="flex items-center gap-3 overflow-hidden">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full bg-zinc-200 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-sm font-medium truncate text-foreground">
                  {user?.name || "User"}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0 cursor-pointer"
                title="Logout"
              >
                <SignOut weight="bold" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Open Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="absolute top-4 left-4 z-50 p-2.5 bg-card border border-card-border rounded-xl shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-muted hover:text-foreground cursor-pointer"
            title="Open Sidebar"
          >
            <List weight="bold" className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

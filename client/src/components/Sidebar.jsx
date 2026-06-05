"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SidebarSimpleIcon } from "@phosphor-icons/react";
import useChat from "@/features/chats/useChat";

import SidebarHeader from "./sidebar/SidebarHeader";
import ChatHistory from "./sidebar/ChatHistory";
import SidebarFooter from "./sidebar/SidebarFooter";

export default function Sidebar() {
  const {
    sidebarChats,
    currentChat,
    loadChat,
    clearCurrentChat,
    removeChat,
    togglePinChat,
  } = useChat();

  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close sidebar by default on mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    // Defer state update to avoid synchronous React Compiler warning
    const timer = setTimeout(checkMobile, 0);
    return () => clearTimeout(timer);
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
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
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
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
        className="h-full bg-card flex flex-col shrink-0 overflow-hidden absolute md:relative z-40 left-0 top-0 bottom-0 shadow-2xl md:shadow-none will-change-[width,opacity] transform-gpu"
      >
        <div className="w-[320px] h-full flex flex-col shrink-0">
          <SidebarHeader clearCurrentChat={clearCurrentChat} setIsOpen={setIsOpen} />
          
          <ChatHistory 
            sidebarChats={sidebarChats}
            currentChat={currentChat}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            loadChat={loadChat}
            setIsOpen={setIsOpen}
            togglePinChat={togglePinChat}
            removeChat={removeChat}
          />
          
          <SidebarFooter />
        </div>
      </motion.div>

      {/* Floating Open Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
            onClick={() => setIsOpen(true)}
            className="absolute top-[calc(max(env(safe-area-inset-top),16px))] left-4 md:top-5 z-50 p-2.5 bg-card rounded-xl shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-muted hover:text-foreground cursor-pointer"
            title="Open Sidebar"
          >
            <SidebarSimpleIcon weight="bold" className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

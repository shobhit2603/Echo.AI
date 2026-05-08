"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, CircleNotch, Paperclip } from "@phosphor-icons/react";
import useChat from "@/features/chats/useChat";
import { motion } from "motion/react";

export default function ChatInput() {
  const { sendMessage, isStreaming, currentChat } = useChat();
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSubmit = () => {
    if (!content.trim() || isStreaming) return;
    sendMessage(content, currentChat?._id);
    setContent("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-6 pb-6 md:pb-8">
      <div className="relative flex items-end bg-zinc-200 dark:bg-zinc-800/60 rounded-[28px] p-2 transition-all focus-within:bg-zinc-200/50 dark:focus-within:bg-zinc-800 focus-within:ring-2 focus-within:ring-primary/20">
        
        {/* Attachment Button (Aesthetic) */}
        <div className="p-2 shrink-0">
          <button
            disabled={isStreaming}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 text-muted disabled:opacity-50 cursor-pointer"
            title="Attach file (coming soon)"
          >
            <Paperclip weight="regular" className="w-5 h-5" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Echo.AI..."
          disabled={isStreaming}
          rows={1}
          className="w-full bg-transparent text-foreground placeholder:text-muted resize-none px-2 py-4 max-h-[200px] outline-none border-none focus:ring-0 text-[16px] leading-relaxed disabled:opacity-50 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
        />
        
        <div className="p-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!content.trim() || isStreaming}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
              content.trim() && !isStreaming
                ? "bg-foreground text-background shadow-md cursor-pointer"
                : "bg-zinc-200 dark:bg-zinc-700 text-muted cursor-not-allowed"
            }`}
          >
            {isStreaming ? (
              <CircleNotch weight="bold" className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowUp weight="bold" className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
      <div className="text-center mt-3">
        <span className="text-xs text-muted font-light tracking-wide">
          Echo.AI can make mistakes. Consider verifying important information.
        </span>
      </div>
    </div>
  );
}

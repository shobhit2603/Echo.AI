"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpIcon, CircleNotchIcon, PaperclipIcon, XIcon } from "@phosphor-icons/react";
import useChat from "@/features/chats/useChat";
import { motion } from "motion/react";

export default function ChatInput() {
  const { sendMessage, isStreaming, currentChat } = useChat();
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else if (file) {
      alert("Please upload a PDF file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if ((!content.trim() && !selectedFile) || isStreaming) return;
    sendMessage(content, currentChat?._id, selectedFile);
    setContent("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    <div className="w-full max-w-3xl mx-auto px-4 md:px-6 pb-[calc(max(env(safe-area-inset-bottom),24px))] md:pb-8">
      {selectedFile && (
        <div className="mb-2 flex items-center gap-2 bg-zinc-200/80 dark:bg-zinc-800/80 w-fit px-3 py-1.5 rounded-full text-sm text-foreground shadow-sm">
          <PaperclipIcon className="w-4 h-4 text-primary" />
          <span className="truncate max-w-[200px]">{selectedFile.name}</span>
          <button 
            onClick={clearFile}
            className="ml-1 p-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-full transition-colors"
            disabled={isStreaming}
          >
            <XIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <div className="relative flex items-end bg-zinc-200 dark:bg-zinc-800/60 rounded-[28px] p-2 transition-all focus-within:bg-zinc-200/50 dark:focus-within:bg-zinc-800 focus-within:ring-2 focus-within:ring-primary/20">
        
        <div className="p-2 shrink-0">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isStreaming}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all text-muted hover:text-foreground hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach PDF"
          >
            <PaperclipIcon className="w-5 h-5" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          disabled={isStreaming}
          rows={1}
          className="w-full bg-transparent text-foreground placeholder:text-muted resize-none px-2 py-4 max-h-50 outline-none border-none focus:ring-0 text-[16px] leading-relaxed disabled:opacity-50 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
        />

        <div className="p-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={(!content.trim() && !selectedFile) || isStreaming}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${((content.trim() || selectedFile) && !isStreaming)
                ? "bg-foreground text-background shadow-md cursor-pointer"
                : "bg-zinc-200 dark:bg-zinc-700 text-muted opacity-50 cursor-not-allowed"
              }`}
          >
            {isStreaming ? (
              <CircleNotchIcon weight="bold" className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowUpIcon weight="bold" className="w-5 h-5" />
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

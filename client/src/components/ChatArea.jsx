"use client";

import { useEffect, useRef, useCallback } from "react";
import { PentagramIcon } from "@phosphor-icons/react";
import useChat from "@/features/chats/useChat";
import useAuth from "@/features/auth/useAuth";

import ChatHeader from "./chat/ChatHeader";
import WelcomeScreen from "./chat/WelcomeScreen";
import ChatMessage from "./chat/ChatMessage";

export default function ChatArea() {
  const { currentChat, isChatLoading, isStreaming } = useChat();
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Scroll helper: instant during streaming, smooth otherwise
  const scrollToBottom = useCallback((instant = false) => {
    if (instant && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    } else if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Get the latest AI message content to track streaming progress
  const lastMessage = currentChat?.messages?.[currentChat.messages.length - 1];
  const streamingContent =
    isStreaming && lastMessage?.role === "ai" ? lastMessage.content : null;

  // Auto-scroll during streaming — fires on every chunk
  useEffect(() => {
    if (isStreaming && streamingContent !== null) {
      scrollToBottom(true);
    }
  }, [streamingContent, isStreaming, scrollToBottom]);

  // Smooth scroll on new messages (non-streaming)
  useEffect(() => {
    if (!isStreaming) {
      scrollToBottom(false);
    }
  }, [currentChat?.messages?.length, isStreaming, scrollToBottom]);

  if (isChatLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <PentagramIcon
          weight="fill"
          className="text-primary w-8 h-8 animate-spin"
        />
      </div>
    );
  }

  // Empty State (New Chat)
  if (!currentChat || currentChat.messages.length === 0) {
    return <WelcomeScreen />;
  }

  // Active Chat State
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <ChatHeader currentChat={currentChat} />

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 pt-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
          {currentChat.messages.map((msg, index) => (
            <ChatMessage
              key={index}
              msg={msg}
              user={user}
              isStreaming={isStreaming}
              isLastMessage={index === currentChat.messages.length - 1}
            />
          ))}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>
    </div>
  );
}

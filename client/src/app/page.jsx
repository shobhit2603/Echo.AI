"use client";

import { useEffect } from "react";
import useChat from "@/features/chats/useChat";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";

export default function Home() {
  const { loadSidebar } = useChat();

  useEffect(() => {
    loadSidebar();
  }, [loadSidebar]);

  return (
    <div className="flex h-dvh w-full relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Left Section: Sidebar */}
      <Sidebar />

      {/* Right Section: Chat Interface */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        <ChatArea />
        
        {/* Added z-20, relative positioning */}
        <div className="shrink-0  pt-4 relative z-20 ">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}

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
        
        {/* Added z-20, relative positioning, and an inverted shadow to enhance the 3D peeking effect */}
        <div className="shrink-0 bg-background/80 backdrop-blur-md pt-4 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}

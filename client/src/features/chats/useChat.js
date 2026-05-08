"use client";

import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { fetchSidebarChatsApi, fetchChatHistoryApi, deleteChatApi } from "./chat.api";
import {
  setSidebarChats,
  setCurrentChat,
  setSidebarLoading,
  setChatLoading,
  addMessageToCurrentChat,
  appendStreamChunk,
  finalizeStream,
  setIsStreaming,
  addSidebarChatOptimistic,
  removeChatOptimistic,
} from "./chatSlice";

export default function useChat() {
  const dispatch = useDispatch();
  const { sidebarChats, currentChat, isSidebarLoading, isChatLoading, isStreaming } = useSelector((state) => state.chat);

  const loadSidebar = useCallback(async () => {
    dispatch(setSidebarLoading(true));
    try {
      const chats = await fetchSidebarChatsApi();
      dispatch(setSidebarChats(chats));
    } catch (error) {
      console.error("Error loading sidebar chats:", error);
      dispatch(setSidebarLoading(false));
    }
  }, [dispatch]);

  const loadChat = useCallback(async (chatId) => {
    dispatch(setChatLoading(true));
    try {
      const chat = await fetchChatHistoryApi(chatId);
      dispatch(setCurrentChat(chat));
    } catch (error) {
      console.error("Error loading chat history:", error);
      dispatch(setChatLoading(false));
    }
  }, [dispatch]);

  const removeChat = useCallback(async (chatId) => {
    try {
      // Optimistic delete
      dispatch(removeChatOptimistic(chatId));
      await deleteChatApi(chatId);
    } catch (error) {
      console.error("Error deleting chat:", error);
      // If error, reload the sidebar to sync state
      loadSidebar();
    }
  }, [dispatch, loadSidebar]);

  const sendMessage = useCallback(async (content, chatId = null) => {
    if (!content.trim()) return;

    // 1. If we don't have a currentChat but have a chatId, we shouldn't send until loaded.
    // However, if we don't have a chatId, it's a new chat.
    
    // Optimistically add the user message
    dispatch(addMessageToCurrentChat({ role: "user", content }));
    // Optimistically add an empty AI message to stream into
    dispatch(addMessageToCurrentChat({ role: "ai", content: "" }));
    
    dispatch(setIsStreaming(true));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, chatId }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          // Keep the last line in the buffer if it doesn't end with a newline
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim().startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              if (!dataStr) continue;

              try {
                const data = JSON.parse(dataStr);

                if (data.event === "chat_created") {
                  if (!currentChat) {
                    dispatch(setCurrentChat({ _id: data.chatId, title: data.title, messages: [
                      { role: "user", content },
                      { role: "ai", content: "" }
                    ]}));
                  }
                  dispatch(addSidebarChatOptimistic({ _id: data.chatId, title: data.title }));
                } else if (data.event === "message_chunk") {
                  dispatch(appendStreamChunk(data.chunk));
                } else if (data.event === "message_complete") {
                  dispatch(finalizeStream());
                } else if (data.event === "error") {
                  console.error("SSE Error:", data.message);
                  dispatch(finalizeStream());
                }
              } catch (e) {
                // If parsing fails, it might be an incomplete JSON across multiple data lines (rare in this setup but possible)
                console.error("Failed to parse SSE line:", line, e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch(finalizeStream());
    }
  }, [dispatch, currentChat]);

  // Expose a function to clear the current chat state (useful when navigating to a "new chat" route)
  const clearCurrentChat = useCallback(() => {
    dispatch(setCurrentChat(null));
  }, [dispatch]);

  return {
    sidebarChats,
    currentChat,
    isSidebarLoading,
    isChatLoading,
    isStreaming,
    loadSidebar,
    loadChat,
    removeChat,
    sendMessage,
    clearCurrentChat,
  };
}
import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    sidebarChats: [],
    currentChat: null,
    isSidebarLoading: true,
    isChatLoading: false,
    isStreaming: false,
  },
  reducers: {
    setSidebarChats: (state, action) => {
      state.sidebarChats = action.payload;
      state.isSidebarLoading = false;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
      state.isChatLoading = false;
    },
    setSidebarLoading: (state, action) => {
      state.isSidebarLoading = action.payload;
    },
    setChatLoading: (state, action) => {
      state.isChatLoading = action.payload;
    },
    addMessageToCurrentChat: (state, action) => {
      if (state.currentChat) {
        state.currentChat.messages.push(action.payload);
      }
    },
    appendStreamChunk: (state, action) => {
      if (state.currentChat && state.currentChat.messages.length > 0) {
        const lastMessage = state.currentChat.messages[state.currentChat.messages.length - 1];
        if (lastMessage.role === "ai") {
          lastMessage.content += action.payload;
        }
      }
    },
    finalizeStream: (state) => {
      state.isStreaming = false;
    },
    setIsStreaming: (state, action) => {
      state.isStreaming = action.payload;
    },
    addSidebarChatOptimistic: (state, action) => {
      state.sidebarChats.unshift(action.payload);
    },
    removeChatOptimistic: (state, action) => {
      state.sidebarChats = state.sidebarChats.filter((c) => c._id !== action.payload);
      if (state.currentChat && state.currentChat._id === action.payload) {
        state.currentChat = null;
      }
    },
  },
});

export const {
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
} = chatSlice.actions;

export default chatSlice.reducer;
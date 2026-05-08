import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import chatReducer from "@/features/chats/chatSlice";

export const makeStore = () => {
  return configureStore({
    reducer: { 
      auth: authReducer,
      chat: chatReducer,
    },
  });
};

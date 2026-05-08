import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  handleMessage,
  getSidebarChats,
  getChatHistory,
  deleteChat,
} from "../controllers/chat.controller.js";

const chatRouter = Router();

// Protect all chat routes with authentication
chatRouter.use(authMiddleware);

// Send a new message (creates a chat if chatId is not provided)
chatRouter.post("/", handleMessage);

// Get all chats for the logged in user (for sidebar)
chatRouter.get("/", getSidebarChats);

// Get complete history of a specific chat
chatRouter.get("/:chatId", getChatHistory);

// Delete a specific chat
chatRouter.delete("/:chatId", deleteChat);

export default chatRouter;

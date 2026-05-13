import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  handleMessage,
  getSidebarChats,
  getChatHistory,
  deleteChat,
  togglePinChat,
} from "../controllers/chat.controller.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const chatRouter = Router();

// Protect all chat routes with authentication
chatRouter.use(authMiddleware);

// Send a new message (creates a chat if chatId is not provided)
chatRouter.post("/", upload.single("pdf"), handleMessage);

// Get all chats for the logged in user (for sidebar)
chatRouter.get("/", getSidebarChats);

// Get complete history of a specific chat
chatRouter.get("/:chatId", getChatHistory);

// Delete a specific chat
chatRouter.delete("/:chatId", deleteChat);

// Toggle pin status of a specific chat
chatRouter.patch("/:chatId/pin", togglePinChat);

export default chatRouter;

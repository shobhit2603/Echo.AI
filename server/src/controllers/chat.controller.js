import * as chatDao from "../dao/chat.dao.js";
import * as aiService from "../services/ai.service.js";
import { ingestPDF } from "../tools/rag.tool.js";
import fs from "fs";

/**
 * Handle incoming user messages and stream AI responses using SSE
 */
export const handleMessage = async (req, res) => {
  let fileToCleanUp = null; // Track file for guaranteed cleanup

  try {
    const userId = req.user.id;
    const { content, chatId: providedChatId } = req.body;

    // Track the uploaded file path
    if (req.file) {
      fileToCleanUp = req.file.path;
    }

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    let chat;
    let isNewChat = false;

    if (providedChatId) {
      chat = await chatDao.getChatById(providedChatId);
      if (!chat)
        return res
          .status(404)
          .json({ success: false, message: "Chat not found" });

      if (chat.user.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
    } else {
      const titleResponse = await aiService.getTitle({ message: content });
      const title = titleResponse.chatTitle || "New Chat";
      chat = await chatDao.createChat(userId, title);
      isNewChat = true;
    }

    // Process PDF *after* we have a confirmed Chat ID
    if (fileToCleanUp) {
      try {
        // Pass the chatId so Pinecone associates these vectors with ONLY this chat
        await ingestPDF(fileToCleanUp, chat._id.toString());
      } catch (error) {
        console.error("[PDF Ingestion Error]:", error);
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to process the PDF document.",
            error: error.message || error.toString()
          });
      }
    }

    let history = [];
    if (!isNewChat && chat.messages) {
      history = chat.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
    }

    await chatDao.saveMessage(chat._id, "user", content);

    // Setup SSE Headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    if (isNewChat) {
      res.write(
        `data: ${JSON.stringify({ event: "chat_created", chatId: chat._id, title: chat.title })}\n\n`,
      );
    }

    // Call AI Service (Pass the chatId down so the RAG tool knows where to look)
    const stream = await aiService.getAIResponse({
      content,
      history,
      chatId: chat._id.toString(),
    });

    let fullAIResponse = "";

    for await (const chunk of stream) {
      const contentChunk = chunk.content;
      if (contentChunk) {
        fullAIResponse += contentChunk;
        res.write(
          `data: ${JSON.stringify({ event: "message_chunk", chunk: contentChunk })}\n\n`,
        );
      }
    }

    await chatDao.saveMessage(chat._id, "ai", fullAIResponse);

    res.write(`data: ${JSON.stringify({ event: "message_complete" })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Error in handleMessage:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    } else {
      res.write(
        `data: ${JSON.stringify({ event: "error", message: "An error occurred while generating response" })}\n\n`,
      );
      res.end();
    }
  } finally {
    // GUARANTEED CLEANUP: This runs no matter what happens above
    if (fileToCleanUp && fs.existsSync(fileToCleanUp)) {
      try {
        fs.unlinkSync(fileToCleanUp);
      } catch (cleanupError) {
        console.error("Failed to delete temp file:", cleanupError);
      }
    }
  }
};

/**
 * Fetch all chats for the logged in user (used for sidebar)
 */
export const getSidebarChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await chatDao.getUserChats(userId);
    res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Error in getSidebarChats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Fetch the complete message history for a specific chat
 */
export const getChatHistory = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await chatDao.getChatById(chatId);

    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    // Ensure user owns this chat
    if (chat.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    console.error("Error in getChatHistory:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Delete a specific chat and its messages
 */
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Verify ownership before deleting
    const chat = await chatDao.getChatById(chatId);
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    if (chat.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await chatDao.deleteChat(chatId);
    res
      .status(200)
      .json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error in deleteChat:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Toggle pin status of a specific chat
 */
export const togglePinChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { isPinned } = req.body;

    // Verify ownership
    const chat = await chatDao.getChatById(chatId);
    if (!chat) {
      return res
        .status(404)
        .json({ success: false, message: "Chat not found" });
    }

    if (chat.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const updatedChat = await chatDao.togglePinChat(chatId, isPinned);
    res.status(200).json({ success: true, chat: updatedChat });
  } catch (error) {
    console.error("Error in togglePinChat:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

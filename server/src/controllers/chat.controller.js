import * as chatDao from "../dao/chat.dao.js";
import * as aiService from "../services/ai.service.js";

/**
 * Handle incoming user messages and stream AI responses using SSE
 */
export const handleMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, chatId: providedChatId } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    let chat;
    let isNewChat = false;

    if (providedChatId) {
      chat = await chatDao.getChatById(providedChatId);
      if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });
      
      // Verify ownership
      if (chat.user.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
    } else {
      // Create new chat and generate title
      const titleResponse = await aiService.getTitle({ message: content });
      const title = titleResponse.chatTitle || "New Chat";
      chat = await chatDao.createChat(userId, title);
      isNewChat = true;
    }

    // Extract history before saving the new message
    let history = [];
    if (!isNewChat && chat.messages) {
       history = chat.messages.map(msg => ({ role: msg.role, content: msg.content }));
    }

    // Save user message to database
    await chatDao.saveMessage(chat._id, "user", content);

    // Setup SSE Headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Crucial: prevents Next.js proxy and Nginx from buffering the stream chunks
    // Flush headers to establish stream immediately
    res.flushHeaders();

    // Send the chatId to the frontend immediately so they can update URL if it's a new chat
    if (isNewChat) {
      res.write(`data: ${JSON.stringify({ event: 'chat_created', chatId: chat._id, title: chat.title })}\n\n`);
    }

    // Call AI Service
    const stream = await aiService.getAIResponse({ content, history });

    let fullAIResponse = "";

    // Stream the response back to client
    for await (const chunk of stream) {
      const contentChunk = chunk.content;
      if (contentChunk) {
        fullAIResponse += contentChunk;
        res.write(`data: ${JSON.stringify({ event: 'message_chunk', chunk: contentChunk })}\n\n`);
      }
    }

    // Save the final AI message to the database
    await chatDao.saveMessage(chat._id, "ai", fullAIResponse);

    // End the stream
    res.write(`data: ${JSON.stringify({ event: 'message_complete' })}\n\n`);
    res.end();

  } catch (error) {
    console.error("Error in handleMessage:", error);
    // If headers are already sent, we just end the stream with an error event
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    } else {
      res.write(`data: ${JSON.stringify({ event: 'error', message: "An error occurred while generating response" })}\n\n`);
      res.end();
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
      return res.status(404).json({ success: false, message: "Chat not found" });
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
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (chat.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await chatDao.deleteChat(chatId);
    res.status(200).json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error in deleteChat:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

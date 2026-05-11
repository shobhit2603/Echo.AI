import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

/**
 * Creates a new chat session for a user
 */
export const createChat = async (userId, title = "New Chat") => {
  const newChat = new Chat({
    user: userId,
    title,
  });
  return await newChat.save();
};

/**
 * Gets all chats for a specific user, sorted by newest first
 */
export const getUserChats = async (userId) => {
  return await Chat.find({ user: userId })
    .sort({ isPinned: -1, _id: -1 })
    .select("-messages"); // Exclude messages for sidebar listing
};

/**
 * Gets a chat by its ID along with all its populated messages
 */
export const getChatById = async (chatId) => {
  return await Chat.findById(chatId).populate({
    path: "messages",
    options: { sort: { timestamp: 1 } },
  });
};

/**
 * Deletes a chat and all associated messages
 */
export const deleteChat = async (chatId) => {
  // First delete all messages associated with this chat
  await Message.deleteMany({ chatId });
  // Then delete the chat itself
  return await Chat.findByIdAndDelete(chatId);
};

/**
 * Saves a new message and adds its reference to the corresponding chat
 */
export const saveMessage = async (chatId, role, content) => {
  const newMessage = new Message({
    chatId,
    role,
    content,
  });

  const savedMessage = await newMessage.save();

  // Push message ID to the chat's messages array
  await Chat.findByIdAndUpdate(chatId, {
    $push: { messages: savedMessage._id },
  });

  return savedMessage;
};

/**
 * Updates the title of an existing chat
 */
export const updateChatTitle = async (chatId, title) => {
  return await Chat.findByIdAndUpdate(
    chatId,
    { title },
    { new: true }
  );
};

/**
 * Toggles the pinned status of a chat
 */
export const togglePinChat = async (chatId, isPinned) => {
  return await Chat.findByIdAndUpdate(
    chatId,
    { isPinned },
    { new: true }
  );
};

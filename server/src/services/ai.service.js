import { ChatMistralAI } from "@langchain/mistralai";
import config from "../config/config.js";

// Production ready model configuration with retries and appropriate temperature
const model = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: config.MISTRAL_API_KEY,
  temperature: 0.7, // Good balance for a conversational chat app
  maxRetries: 3,    // Fault tolerance for API failures
});

const DEFAULT_SYSTEM_PROMPT = {
  role: "system",
  content: "You are Echo, a highly intelligent, helpful, and friendly AI assistant. Provide concise, clear, and accurate answers.",
};

/**
 * Gets AI response as a stream, supporting conversation history
 * @param {Object} params
 * @param {string} params.content - The latest user message content
 * @param {Array} [params.history=[]] - Array of previous messages [{role: 'user'|'assistant', content: '...'}]
 * @param {string} [params.systemPrompt] - Optional custom system prompt
 */
export async function getAIResponse({ content, history = [], systemPrompt = null }) {
  try {
    if (!content && (!history || history.length === 0)) {
      throw new Error("Content or conversation history is required.");
    }

    const formattedMessages = [];

    // 1. Add System Prompt
    if (systemPrompt) {
      formattedMessages.push(["system", systemPrompt]);
    } else {
      formattedMessages.push(["system", DEFAULT_SYSTEM_PROMPT.content]);
    }

    // 2. Add Conversation History (remember previous chats)
    if (Array.isArray(history) && history.length > 0) {
      history.forEach(msg => {
        // Map 'ai' to 'assistant' for Langchain
        const role = msg.role === 'ai' ? 'assistant' : msg.role;
        formattedMessages.push([role, msg.content]);
      });
    }

    // 3. Add the New User Message
    if (content) {
      formattedMessages.push(["user", content]);
    }

    const stream = await model.stream(formattedMessages);
    return stream;
  } catch (error) {
    console.error("[AI Service Error] getAIResponse failed:", error.message);
    throw new Error("Failed to get AI response. Please try again later.");
  }
}

/**
 * Generates a concise title for a chat based on the initial message
 * @param {Object} params
 * @param {string} params.message - The user's first message
 */
export async function getTitle({ message }) {
  try {
    if (!message) throw new Error("Message is required to generate a title.");

    // Using a lower temperature model for more deterministic title generation
    const titleModel = new ChatMistralAI({
      model: "mistral-medium-latest",
      apiKey: config.MISTRAL_API_KEY,
      temperature: 0.2, 
      maxRetries: 2,
    });

    const response = await titleModel.invoke([
      ["system", "You are a helpful assistant that generates concise, engaging titles for chat conversations. Output ONLY the title text, maximum 5 words, without any quotes or prefixes."],
      ["user", `Generate a title for: "${message}"`]
    ]);

    const cleanTitle = response.content.replace(/["']/g, "").trim();
    return { chatTitle: cleanTitle || "New Chat" };
  } catch (error) {
    console.error("[AI Service Error] getTitle failed:", error.message);
    // Fallback instead of breaking the application
    return { chatTitle: "New Conversation" };
  }
}

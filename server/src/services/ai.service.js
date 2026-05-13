import { ChatMistralAI } from "@langchain/mistralai";
import { createToolCallingAgent, AgentExecutor } from "@langchain/classic/agents";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import * as z from "zod";
import config from "../config/config.js";
import { ragSearch } from "../tools/rag.tool.js";
import { search } from "../tools/search.tool.js";

// Production ready model configuration
const model = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: config.MISTRAL_API_KEY,
  temperature: 0.7,
  maxRetries: 3,
});

const search_tool = tool(search, {
  name: "search_tool",
  description:
    "Use this tool to find the latest information on the internet. Use this ONLY if the information is not in the user's provided documents.",
  schema: z.object({
    query: z.string().describe("The search query to find information about"),
  }),
});

const rag_tool = tool(ragSearch, {
  name: "rag_tool",
  description:
    "MANDATORY tool to use when the user asks questions about their uploaded PDFs, documents, or internship details. Searches the vector database.",
  schema: z.object({
    query: z.string().describe("The specific query to search in the vector database"),
  }),
});

const tools = [search_tool, rag_tool];

// Define the precise prompt for the agent
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "{system_prompt}"],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"), // Crucial for tool calling memory
]);

// Initialize the Agent and Executor
const agent = createToolCallingAgent({
  llm: model,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  // Set to true if you want to see tool execution logs in your console
  verbose: process.env.NODE_ENV !== "production",
});

const DEFAULT_SYSTEM_PROMPT = `You are Echo, a highly intelligent, helpful, and friendly AI assistant. 
When a user asks about a document or PDF, you MUST use the 'rag_tool' to fetch the context. 
If the answer is not found in the retrieved document context, state clearly that the document does not contain the information rather than making it up. Provide concise, clear, and accurate answers.`;

export async function* getAIResponse({ content, history = [], systemPrompt = null, chatId = null }) {
  try {
    if (!content && (!history || history.length === 0)) {
      throw new Error("Content or conversation history is required.");
    }

    // 1. Format System Prompt
    const finalSystemPrompt = `${systemPrompt || DEFAULT_SYSTEM_PROMPT}\nCurrent date and time: ${new Date().toLocaleString()}`;

    // 2. Format Conversation History into LangChain Message objects
    const formattedHistory = history.map((msg) => {
      const role = msg.role === "ai" ? "assistant" : msg.role;
      return role === "assistant"
        ? new AIMessage(msg.content)
        : new HumanMessage(msg.content);
    });

    // Create dynamic tool to inject chatId
    const dynamic_rag_tool = tool(
      async ({ query }) => ragSearch({ query, chatId }),
      {
        name: "rag_tool",
        description:
          "MANDATORY tool to use when the user asks questions about their uploaded PDFs, documents, or internship details. Searches the vector database.",
        schema: z.object({
          query: z.string().describe("The specific query to search in the vector database"),
        }),
      }
    );

    const dynamicTools = [search_tool, dynamic_rag_tool];

    const dynamicAgent = createToolCallingAgent({
      llm: model,
      tools: dynamicTools,
      prompt,
    });

    const dynamicExecutor = new AgentExecutor({
      agent: dynamicAgent,
      tools: dynamicTools,
      verbose: process.env.NODE_ENV !== "production",
    });

    // 3. Execute the agent and stream events
    const events = dynamicExecutor.streamEvents(
      {
        input: content || "Continue",
        chat_history: formattedHistory,
        system_prompt: finalSystemPrompt,
      },
      { version: "v2" }
    );

    for await (const event of events) {
      // Stream only the final model output, ignoring the internal tool-calling thoughts
      if (
        event.event === "on_chat_model_stream" &&
        event.name === "ChatMistralAI"
      ) {
        const chunkContent = event.data.chunk.content;

        // Ensure we only yield actual text content, not tool invocation chunks
        if (chunkContent && typeof chunkContent === 'string') {
          yield { content: chunkContent };
        }
      }
    }
  } catch (error) {
    console.error("[AI Service Error] getAIResponse failed:", error.message);
    throw new Error("Failed to get AI response. Please try again later.");
  }
}

export async function getTitle({ message }) {
  try {
    if (!message) throw new Error("Message is required to generate a title.");

    const titleModel = new ChatMistralAI({
      model: "mistral-medium-latest",
      apiKey: config.MISTRAL_API_KEY,
      temperature: 0.2,
      maxRetries: 2,
    });

    const response = await titleModel.invoke([
      [
        "system",
        "You are a helpful assistant that generates concise, engaging titles for chat conversations. Output ONLY the title text, maximum 5 words, without any quotes or prefixes.",
      ],
      ["user", `Generate a title for: "${message}"`],
    ]);

    const cleanTitle = response.content.replace(/["']/g, "").trim();
    return { chatTitle: cleanTitle || "New Chat" };
  } catch (error) {
    console.error("[AI Service Error] getTitle failed:", error.message);
    return { chatTitle: "New Conversation" };
  }
}
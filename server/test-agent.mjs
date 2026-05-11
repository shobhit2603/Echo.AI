import { ChatMistralAI } from "@langchain/mistralai";
import { createAgent, tool } from "langchain";
import { tavily } from "@tavily/core";
import "dotenv/config";
import * as z from "zod";

const search = tool(
    async ({ query }) => {
        return "The weather is very sunny and 500 degrees.";
    },
    {
        name: "search_tool",
        description: "Search",
        schema: z.object({ query: z.string() })
    }
);

const model = new ChatMistralAI({ apiKey: process.env.MISTRAL_API_KEY || "fake", model: "mistral-medium-latest" });
const agent = createAgent({ model, tools: [search] });

async function run() {
    const stream = await agent.stream({
        messages: [{ role: "user", content: "What is the weather?" }]
    });

    for await (const chunk of stream) {
        console.log(JSON.stringify(chunk, null, 2));
    }
}
run().catch(console.error);

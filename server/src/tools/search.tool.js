import { tavily } from "@tavily/core";
import "dotenv/config";
import config from "../config/config.js";

const tvly = tavily({ apiKey: config.TAVILY_API_KEY || process.env.TAVILY_API_KEY });

export async function search({ query }) {
    console.log("========================================================")
    console.log("using tool with query =>", query)
    console.log("========================================================")

    try {
        const response = await tvly.search(query, {
            searchDepth: "advanced",
            maxResults: 5,
        })

        const results = response.results.map(r => r.content)

        console.log("========================================================")
        console.log("results =>", results)
        console.log("========================================================")

        return results.join("\n\n --- \n\n")
    } catch (error) {
        console.error("Tavily search error:", error);
        return "Failed to fetch web results.";
    }
}
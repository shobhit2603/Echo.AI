import { MistralAIEmbeddings } from "@langchain/mistralai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { v4 as uuidv4 } from "uuid";
import config from "../config/config.js";

const embeddings = new MistralAIEmbeddings({
  apiKey: config.MISTRAL_API_KEY,
  model: "mistral-embed",
});

const pinecone = new PineconeClient({
  apiKey: config.PINECONE_API_KEY,
});

export async function ragSearch({ query, chatId }) {
  try {
    console.log("========================================================");
    console.log("using rag tool with query =>", query, "for chat =>", chatId);
    console.log("========================================================");

    const index = pinecone.Index("kodr-rag");
    const vector = await embeddings.embedQuery(query);

    const queryOptions = {
      vector,
      topK: 4,
      includeMetadata: true,
    };
    
    if (chatId) {
      queryOptions.filter = { chatId: { $eq: chatId } };
    }

    const queryResult = await index.query(queryOptions);

    console.log("========================================================");
    console.log(`rag tool found ${queryResult.matches?.length || 0} matches.`);
    console.log("========================================================");

    if (queryResult.matches && queryResult.matches.length > 0) {
      const resultText = queryResult.matches.map((match) => {
        return match.metadata?.text || JSON.stringify(match.metadata);
      });
      return resultText.join("\n\n --- \n\n");
    }

    return "No relevant information found in the documents.";
  } catch (error) {
    console.error("Error in ragSearch:", error);
    throw error;
  }
}

export async function ingestPDF(pdfPath, chatId) {
  try {
    console.log("========================================================");
    console.log("ingesting pdf =>", pdfPath, "for chat =>", chatId);
    console.log("========================================================");

    // 1. Load the PDF
    const loader = new PDFLoader(pdfPath, {
      splitPages: true,
    });
    const rawDocs = await loader.load();

    // 2. Split text into manageable chunks with overlap
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    console.log(`Split PDF into ${docs.length} chunks.`);

    // 3. Generate embeddings
    const vectors = await embeddings.embedDocuments(
      docs.map((doc) => doc.pageContent),
    );

    // 4. Format records for Pinecone
    const records = vectors.map((vector, index) => ({
      id: uuidv4(),
      values: vector,
      metadata: {
        text: docs[index].pageContent,
        page: docs[index].metadata?.loc?.pageNumber || 1,
        ...(chatId ? { chatId } : {}),
      },
    }));

    const index = pinecone.Index("kodr-rag");

    // 5. Batch upsert
    const batchSize = 100;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      console.log(`Upserting batch of size ${batch.length}`);
      await index.upsert({ records: batch });
      console.log(`Upserted batch ${i / batchSize + 1}`);
    }

    console.log("========================================================");
    console.log("ingest complete.");
    console.log("========================================================");

    return { success: true, chunksIngested: records.length };
  } catch (error) {
    console.error("Error in ingestPDF:", error);
    throw error;
  }
}
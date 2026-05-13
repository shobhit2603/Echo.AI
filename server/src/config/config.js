import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.PORT ||
  !process.env.MONGO_URI ||
  !process.env.JWT_SECRET ||
  !process.env.CLIENT_URL ||
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.GOOGLE_CALLBACK_URL ||
  !process.env.MISTRAL_API_KEY ||
  !process.env.TAVILY_API_KEY ||
  !process.env.PINECONE_API_KEY
) {
  console.error(
    "Missing required environment variables. Please check your .env file.",
  );
  process.exit(1);
}

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  TAVILY_API_KEY: process.env.TAVILY_API_KEY,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default config;

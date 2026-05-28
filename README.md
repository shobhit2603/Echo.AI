<div align="center">

# 🤖 Echo.AI

### _Your Intelligent AI Companion for Real-time Web Search & Semantic RAG Document Q&A_

**Modern Chat UI · Google OAuth Authentication · LangChain Agentic Workflow · Tavily Web Search · PDF RAG Indexing**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![LangChain](https://img.shields.io/badge/LangChain-1.4-1C3C3A?style=for-the-badge&logo=chainlink&logoColor=white)](https://langchain.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 What is Echo.AI?

**Echo.AI** is a robust, production-ready full-stack AI Assistant application. It delivers a fluid chat experience coupled with advanced cognitive capabilities:
- **Web-search fallback capability** using Tavily to supply contextually accurate, real-time data for general queries.
- **Retrieval-Augmented Generation (RAG)** pipeline allowing users to upload PDF documents and converse directly with them using vector search indexing on **Pinecone**.
- **Intuitive UI controls** such as chat pinning, session history management, and a clean, responsive layout built using Next.js 16 and Redux.

The application leverages a modular, **feature-based architecture** separating concerns clearly, enabling developers to scale components independently.

---

## ✨ Features

- 🔐 **Google OAuth 2.0 Login** — Seamlessly authenticate using Google credentials. The backend handles callback flows and issues JWTs in secure cookies.
- 💬 **Dynamic AI Chatbot** — Powered by **Mistral AI (`mistral-medium-latest`)** and orchestrated through LangChain's Tool-Calling Agent logic.
- 📑 **Contextual PDF Q&A (RAG)** — Upload documents (e.g. PDFs) within chat threads. The system extracts text content, splits it character-wise with overlaps, embeds it using **Mistral Embeddings**, and stores it inside **Pinecone** for instant lookup.
- 🌐 **Real-time Web Search** — Automated fallback search query triggering via **Tavily AI Search** when questions require recent or external internet data.
- 📌 **Chat Management** — Create, delete, and pin chats to keep important conversations accessible in the sidebar.
- 📁 **Conversational Memory** — Session-based chat history that maintains context across consecutive user queries.
- 📦 **Containerized Workspace** — Built with local Docker orchestration support for single-command environment setups.

---

## 🏗️ Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| Next.js 16 | React framework & server-side rendering support |
| React 19 | UI rendering engine |
| Redux Toolkit | Centralized state management (chats, auth, theme) |
| Tailwind CSS v4 | Native utility-first stylesheet layouts |
| Motion (Framer) | High-performance CSS micro-animations & transitions |
| Spline 3D | Interactive 3D design components |
| Phosphor Icons | Premium icon design resources |

### Backend (`/server`)
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API router and controller hosting |
| MongoDB + Mongoose | Document Database and ODM modeling |
| LangChain JS | Agent orchestration, prompts, and vector chain utilities |
| Pinecone Client | Cloud-native vector search database handling |
| Passport.js | Social Google OAuth configuration |
| JSONWebToken | Secure, stateless authentication token handling |
| Multer | Multipart middleware for PDF file uploads |
| PDF-Parse | Server-side text extraction from documents |

---

## 📂 Project Structure

```
Echo.AI/
├── client/                  # Next.js Frontend
│   ├── public/              # Static assets (favicons, manifest)
│   └── src/
│       ├── app/             # Routing directory (globals.css, layout, pages)
│       │   └── auth/        # Google Auth callback handler page
│       ├── components/      # UI components (ChatArea, ChatInput, Sidebar)
│       ├── features/        # Client business-logic features
│       │   ├── auth/        # Redux slices and hook wrappers for OAuth
│       │   └── chats/       # Chat operations, streaming Hooks, and APIs
│       └── store/           # Redux global store configurations
│
├── server/                  # Node.js + Express.js Backend
│   ├── uploads/             # Temporary folder for file uploads
│   └── src/
│       ├── app.js           # Server routing, CORS, and passport initializations
│       ├── config/          # Database connections and Env specifications
│       ├── controllers/     # Request handlers (auth, chat)
│       ├── dao/             # Data Access Objects (encapsulated database queries)
│       ├── middlewares/     # JWT verification and error captures
│       ├── models/          # MongoDB Mongoose schemas (User, Chat, Message)
│       ├── routes/          # API route definitions
│       ├── services/        # AI & LangChain agent orchestration
│       ├── tools/           # Tavily Web Search and Pinecone RAG handlers
│       └── utils/           # Shared helper utilities
│
└── docker-compose.yml       # Docker orchestration compose file
```

---

## 🔌 API Reference

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| `GET`  | `/google` | Public | Redirects user to Google OAuth credentials screen |
| `GET`  | `/google/callback` | Google Redirect | Processes Google OAuth profile data and issues JWT cookies |
| `GET`  | `/user` | Bearer/Cookie | Resolves profile details of currently authenticated user |
| `POST` | `/logout` | Bearer/Cookie | Clears auth tokens and logs out user session |

### 💬 Chat & RAG — `/api/chat`

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| `GET`  | `/` | Bearer/Cookie | Fetches all chat sessions for sidebar lists |
| `POST` | `/` | Bearer/Cookie | Sends user query. Supports multipart forms with an optional file attachment `pdf` |
| `GET`  | `/:chatId` | Bearer/Cookie | Retrieves complete conversational message history of a chat |
| `DELETE` | `/:chatId` | Bearer/Cookie | Deletes the chat session and clears related stored messages |
| `PATCH` | `/:chatId/pin` | Bearer/Cookie | Toggles the pinned status on the specified chat session |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (version 20+)
- MongoDB Atlas database connection URL
- Google Cloud developer credentials (for Google OAuth client ID and Secret)
- Mistral AI developer API Key
- Tavily search API Key
- Pinecone DB index named `kodr-rag` with **1024** dimensions (compatible with `mistral-embed`)

---

### Method 1: Running Manually (Locally)

#### 1. Clone the repository
```bash
git clone https://github.com/shobhit2603/Echo.AI.git
cd Echo.AI
```

#### 2. Set Up the Backend Server
```bash
cd server
npm install
```

Create a `.env` file inside `/server`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key_secret
CLIENT_URL=http://localhost:3000

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=/api/auth/google/callback

# AI Keys
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

Run the backend in development mode:
```bash
npm run dev
```
The server will boot up and listen on `http://localhost:5000`.

#### 3. Set Up the Client Frontend
```bash
cd ../client
npm install
```

Create a `.env` file inside `/client`:
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

Start the Next.js development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

### Method 2: Running with Docker-Compose

To spin up both frontend and backend instantly with live-reloading (hot reloading) capabilities:

#### 1. Ensure you have `.env` files configured
Make sure you have created `/server/.env` and `/client/.env` files containing the relevant keys (as defined in the manual setup section).

#### 2. Launch Docker Compose
In the root directory of the project, execute:
```bash
docker-compose up --build
```
This command automatically reads the `docker-compose.yml` file, builds the server and client images from their respective dockerfiles, installs dependencies, mounts development directories with node_modules caches, and starts the services.

- **Frontend client** is exposed on: `http://localhost:3000`
- **Backend server** is exposed on: `http://localhost:5000`

To stop the containers, run:
```bash
docker-compose down
```

---

## 🌐 Deployment

| Service | Host Provider | Configuration |
|---|---|---|
| **Frontend Client** | **Vercel** | Connect your Git repository, set the root directory to `client`, configure `NEXT_PUBLIC_SERVER_URL` in environment variables. |
| **Backend Server** | **Render** | Create a Web Service, specify base directory as `server`, and configure environment variables. |
| **Database** | **MongoDB Atlas** | Managed MongoDB Cloud Database |
| **Vector DB** | **Pinecone** | Cloud Vector DB storing 1024-dimension embeddings |

> [!NOTE]
> Ensure that you white-list production URLs in your Google Developer console redirects (`/api/auth/google/callback`) and that the CORS allowed origin on Render aligns with your deployed Next.js address.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more details.

---

<div align="center">

Built with ❤️ by [Shobhit](https://github.com/shobhit2603)

</div>

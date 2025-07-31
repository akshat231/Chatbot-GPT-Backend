# 🧠 AI Chatbot Backend (Supabase + OpenAI)

This is the **backend** of an AI-powered chatbot SaaS platform built with **Node.js** and **Supabase**. It handles all API operations including authentication, bot and content management, and AI-driven querying using embeddings and the OpenAI API.

---

## 🚀 Features

- ✅ User Signup / Login (Email + OTP)
- ✅ Create / Delete Bots
- ✅ Add / Delete Documents & Content
- ✅ Update Bot Configuration
- ✅ Ask Queries to Bot
- ✅ Generate & Store Embeddings in Supabase
- ✅ Use Supabase RPC for Vector Search
- ✅ Use OpenAI API to get answers from embeddings

---

## 🛠️ Tech Stack

- Node.js / Express
- Supabase (PostgreSQL + Auth + Storage)
- OpenAI API
- TypeScript
- Redis (optional for caching)
- Winston (for logging)
- JWT or Supabase Auth

---

## 📦 API Endpoints

### 🔐 Auth
- `POST /api/user/signup` — Register with email
- `POST /api/user/login` — Request OTP
- `POST /api/user/verify` — Verify OTP and authenticate

### 🤖 Bot Management
- `POST /api/bot/createBot` — Create new bot
- `DELETE /api/bot/deleteBot` — Delete a bot

### 📄 Document & Content
- `POST /api/bot/addContent` — Add content to a bot
- `DELETE /api/doc/deleteDoc` — Delete content
- `GET /api/bot/getBot` — Fetch all content for a bot

### ⚙️ Configuration
- `GET /api/bot/getBotConfig` — Change configuration of a bot

### ❓ Querying
- `POST /api/bot/query` — Ask question to bot
  - Steps:
    1. Fetch related chunks via Supabase RPC (vector search)
    2. Compose context
    3. Send prompt to OpenAI API
    4. Return response to user

---

## 🧠 Embeddings & AI Flow

1. Content is chunked (text splitting logic)
2. Each chunk is embedded using OpenAI Embedding API
3. Embeddings are stored in Supabase `chunks` table
4. On user query:
   - Supabase RPC function (`match_documents`) fetches relevant chunks
   - Prompt is constructed using these chunks
   - Sent to OpenAI Chat Completion API
   - Response is returned to frontend

---

## 🧾 Supabase Schema Overview

- `users` — User records
- `bots` — One bot per namespace
- `documents` — PDF or website source
- `chunks` — Vector embeddings with metadata
- `query_logs` — Query history for analytics
- `bot_config` — Bot Configuration related to model

---

## 🌐 Environment Variables (`.env`)

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
JWT_SECRET=...
```
## ▶️ Running the Server

```bash
npm install
npm run start
```

## 📬 Contact
For issues or contributions, open a PR or reach out at akshatsharmasde@gmail.com.

## 📄 License
MIT License


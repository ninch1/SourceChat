# SourceChat

SourceChat is a backend API for uploading text documents and asking questions about them using RAG.

The app splits documents into chunks, generates embeddings with Jina, stores vector embeddings in PostgreSQL with pgvector, retrieves relevant chunks by similarity, and uses Gemini to generate answers with sources.

## Features

- Upload `.txt` documents
- Create documents from JSON text
- Split documents into searchable chunks
- Generate embeddings with Jina
- Store vectors using PostgreSQL and pgvector
- Retrieve relevant chunks using cosine similarity
- Generate grounded answers with Gemini
- Return sources with each answer
- Handle unrelated questions with fallback responses
- Centralized error handling
- Standardized API response format

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- pgvector
- Docker
- Jina Embeddings API
- Gemini API
- Zod
- Multer

## Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=3000

DATABASE_URL="postgresql://sourcechat_user:sourcechat_password@localhost:5433/sourcechat_db"

JINA_API_KEY="your_jina_api_key_here"
JINA_EMBEDDING_MODEL="jina-embeddings-v5-text-small"

GEMINI_API_KEY="your_gemini_api_key_here"
GEMINI_MODEL="gemini-3.1-flash-lite"
```

## Running Locally

Start the PostgreSQL database:

```bash
docker compose up -d
```

Install dependencies:

```bash
npm install
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

The server will run on:

```txt
http://localhost:3000
```

## API Endpoints

### Health

```txt
GET /api/health
```

### Documents

Get all documents:

```txt
GET /api/documents
```

Create a document from JSON:

```txt
POST /api/documents
```

Example body:

```json
{
  "title": "SourceChat Notes",
  "text": "Your document text here..."
}
```

Upload a text file:

```txt
POST /api/documents/upload
```

Form-data fields:

```txt
file: .txt file
title: optional title
```

Get a document by ID:

```txt
GET /api/documents/:id
```

Delete a document by ID:

```txt
DELETE /api/documents/:id
```

### Ask a Question

```txt
POST /api/ask
```

Example body:

```json
{
  "question": "How does semantic search work?"
}
```

Example response:

```json
{
  "success": true,
  "message": "Question answered successfully",
  "data": {
    "question": "How does semantic search work?",
    "answer": "Semantic search works by comparing a query embedding against stored document chunk embeddings.",
    "sources": [
      {
        "chunkId": 1,
        "documentId": 1,
        "documentTitle": "SourceChat Notes",
        "text": "pgvector is a PostgreSQL extension for storing and searching vector embeddings.",
        "distance": 0.58
      }
    ]
  }
}
```

## API Response Format

Successful responses use this format:

```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

Error responses use this format:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Project Status

The backend RAG API is functional.

Current backend features include document upload, document chunking, embedding generation, vector search, Gemini answer generation, fallback responses, centralized error handling, and standardized API responses.

Planned future improvements:

- React frontend
- User authentication
- User-owned documents
- PDF and DOCX upload support
- Improved chunking with overlap
- More advanced retrieval tuning

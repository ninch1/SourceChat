# SourceChat

SourceChat is a backend API for uploading text documents and asking questions about them using RAG.

The app splits documents into chunks, generates embeddings with Jina, stores vector embeddings in PostgreSQL with pgvector, retrieves relevant chunks by similarity, and uses Gemini to generate grounded answers with sources.

SourceChat also includes user authentication, user-owned documents, refresh-token session handling, protected routes, rate limiting, and API security hardening.

## Features

### Authentication

- User registration and login
- Password hashing with bcrypt
- JWT access-token authentication
- Refresh-token based session renewal
- Refresh-token rotation
- Refresh-token reuse detection
- Hashed refresh tokens stored in the database
- httpOnly refresh-token cookies
- Logout with refresh-token revocation
- Current-user endpoint
- Protected backend routes

### Documents

- Upload `.txt` documents
- Create documents from JSON text
- User-owned document storage
- Get all documents for the authenticated user
- Get a single document by ID
- Update document titles
- Delete one document
- Delete all documents for the authenticated user
- Paginated document listing
- Split documents into searchable chunks
- Limit document chunk count to prevent excessive embedding API calls

### RAG Question Answering

- Generate embeddings with Jina
- Store vectors using PostgreSQL and pgvector
- Retrieve relevant chunks using vector similarity search
- Generate grounded answers with Gemini
- Return sources with each answer
- Return document title, chunk text, and relevance score for sources
- Prevent cross-user retrieval with user-scoped search
- Handle unrelated questions with fallback responses

### API Hardening

- Centralized error handling
- Standardized API response format
- Zod request validation
- Prisma unique constraint error handling
- CORS configured from environment variables
- Helmet security headers
- Global API rate limiting
- Auth route rate limiting
- Refresh route rate limiting
- AI route rate limiting
- Production `trust proxy` support for deployment behind a proxy
- Request body limits
- Environment variables excluded from Git

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
- bcrypt
- JSON Web Tokens
- cookie-parser
- express-rate-limit
- Helmet

## Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=3000
NODE_ENV="development"

DATABASE_URL="postgresql://sourcechat_user:sourcechat_password@localhost:5433/sourcechat_db"

CLIENT_ORIGIN="http://localhost:5173"

JINA_API_KEY="your_jina_api_key_here"
JINA_EMBEDDING_MODEL="jina-embeddings-v5-text-small"

GEMINI_API_KEY="your_gemini_api_key_here"
GEMINI_MODEL="gemini-3.1-flash-lite"

ACCESS_TOKEN_SECRET="your_access_token_secret_here"
REFRESH_TOKEN_SECRET="your_refresh_token_secret_here"

GENERAL_RATE_LIMIT=300
AUTH_RATE_LIMIT=20
AI_RATE_LIMIT=30
REFRESH_RATE_LIMIT=60

```

## Running Locally

Start the PostgreSQL database (from the repo root):

```bash
docker compose -f server/docker-compose.yml up -d
```

Install dependencies:

```bash
cd server
npm install
```

Run database migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

Start the development server:

```bash
npm run dev
```

The server will run on:

```txt
http://localhost:3000
```

For the React client, copy `client/.env.example` to `client/.env` and set:

```txt
VITE_API_URL=http://localhost:3000/api
```

In production, set `NODE_ENV=production`, a real `CLIENT_ORIGIN` matching your frontend origin, and strong unique `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET`. Use `npx prisma migrate deploy` (not `migrate dev`) on the production database.

## API Endpoints

### Health

```http
GET /api/health

```

### Auth

Register a user:

```http
POST /api/auth/register

```

Example body:

```json
{
  "email": "user@example.com",
  "username": "demo_user",
  "password": "Password123"
}
```

Log in:

```http
POST /api/auth/login

```

Example body:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

Refresh access token:

```http
POST /api/auth/refresh

```

The refresh token is stored in an httpOnly cookie and sent automatically by the client.

Get current user:

```http
GET /api/auth/me

```

Requires an access token.

Log out:

```http
POST /api/auth/logout

```

Logs out the user by revoking the active refresh token and clearing the refresh-token cookie.

### Documents

Get all documents:

```http
GET /api/documents

```

Optional pagination:

```http
GET /api/documents?page=1&limit=10

```

Create a document from JSON:

```http
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

```http
POST /api/documents/upload

```

Form-data fields:

```txt
file: .txt file
title: optional title

```

Get a document by ID:

```http
GET /api/documents/:id

```

Update a document title:

```http
PATCH /api/documents/:id

```

Example body:

```json
{
  "title": "Updated Document Title"
}
```

Delete a document by ID:

```http
DELETE /api/documents/:id

```

Delete all documents for the authenticated user:

```http
DELETE /api/documents

```

### Ask a Question

```http
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
        "relevanceScore": 0.72
      }
    ]
  }
}
```

## Authentication Notes

Protected routes require an access token in the `Authorization` header:

```http
Authorization: Bearer your_access_token_here

```

Refresh tokens are stored in httpOnly cookies. They are not returned in the JSON response. This helps prevent frontend JavaScript from reading the refresh token.

The refresh endpoint rotates refresh tokens. If refresh-token reuse is detected, the user's stored refresh tokens are revoked.

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

Validation errors may also include an `errors` array.

## Development Checks

Run TypeScript build:

```bash
npm run build

```

Useful Prisma commands:

```bash
npx prisma migrate dev
npx prisma generate

```

## Project Status

The backend RAG API is functional and includes authentication, user-owned documents, document upload, document chunking, embedding generation, vector search, Gemini answer generation, fallback responses, centralized error handling, rate limiting, and security hardening.

## Future Improvements

- React frontend
- PDF and DOCX upload support
- Improved chunking with overlap
- More advanced retrieval tuning
- Better source ranking
- Streaming answers
- Conversation history
- Deployment with hosted frontend and backend

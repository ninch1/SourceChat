import { prisma } from '../lib/prisma.js';
import { generateEmbeddingQuery } from '../services/embeddingService.js';
import ErrorResponse from '../errors/errorResponse.js';

// Service to retrieve chunks using cosine similarity

// maximum distance for a chunk to be considered relevant
const MAX_DISTANCE = 0.75;

// type for a chunk that has been retrieved from the database using cosine similarity
export type RetrievedChunk = {
  chunkId: number;
  documentId: number;
  documentTitle: string;
  text: string;
  distance: number;
};

const vectorToSql = (embedding: number[]) => {
  return `[${embedding.join(',')}]`;
};

// retrieve chunks using cosine similarity
export const retrieveChunks = async (
  question: string,
  userId: string,
  limit: number = 3,
): Promise<RetrievedChunk[]> => {
  // generate the embedding for the question
  const questionEmbedding = await generateEmbeddingQuery(question);
  const questionVector = vectorToSql(questionEmbedding);

  try {
    const results = await prisma.$queryRaw<RetrievedChunk[]>`
  SELECT
    "Chunk"."id" AS "chunkId",
    "Chunk"."documentId" AS "documentId",
    "Document"."title" AS "documentTitle",
    "Chunk"."text" AS "text",
    "Chunk"."embedding" <=> ${questionVector}::vector AS "distance"
  FROM "Chunk"
  JOIN "Document"
    ON "Document"."id" = "Chunk"."documentId"
  WHERE "Chunk"."embedding" IS NOT NULL AND "Document"."userId" = ${userId}
  ORDER BY "Chunk"."embedding" <=> ${questionVector}::vector
  LIMIT ${limit}
`;

    // filter out chunks that are too far away
    return results.filter((chunk) => chunk.distance <= MAX_DISTANCE);
  } catch (error) {
    console.error('Vector retrieval failed:', error);
    throw new ErrorResponse('Failed to retrieve relevant chunks', 500);
  }
};

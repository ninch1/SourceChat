import { prisma } from '../lib/prisma.js';
import type { Prisma } from '../generated/prisma/client.js';
import { splitTextIntoChunks } from '../utils/textUtils.js';
import { extractKeywords } from '../utils/keywordUtils.js';
import { generateEmbeddingPassage } from './embeddingService.js';
import ErrorResponse from '../errors/errorResponse.js';

type DocumentWithChunks = Prisma.DocumentGetPayload<{
  include: {
    chunks: true;
  };
}>;

// create a document from text with chunks and embeddings
export const createDocumentFromText = async (
  title: string,
  text: string,
  userId: string,
) => {
  const chunks = splitTextIntoChunks(text);

  // create initial document without embeddings
  let document: DocumentWithChunks;
  try {
    document = await prisma.document.create({
      data: {
        title: title.trim(),
        userId: userId,
        chunks: {
          create: chunks.map((chunk) => ({
            text: chunk.trim(),
            keywords: extractKeywords(chunk.trim()),
          })),
        },
      },
      include: {
        chunks: true,
      },
    });
  } catch (error) {
    throw new ErrorResponse('Failed to create document', 500);
  }

  if (document.chunks.length === 0) {
    await prisma.document.delete({
      where: { id: document.id },
    });

    throw new ErrorResponse('No chunks were created', 400);
  }

  // generate embeddings for each chunk
  try {
    for (const chunk of document.chunks) {
      const embedding = await generateEmbeddingPassage(chunk.text);
      const vectorString = `[${embedding.join(',')}]`; // convert the embedding to a string that can be used in the SQL query for pgvector

      await prisma.$executeRaw`
        UPDATE "Chunk"
        SET "embedding" = ${vectorString}::vector
        WHERE "id" = ${chunk.id}
      `;
    }
  } catch (error) {
    // delete the document if the chunk embedding update fails
    await prisma.document.delete({
      where: { id: document.id },
    });

    if (error instanceof ErrorResponse) {
      throw error;
    }

    console.error('Failed to create document embeddings:', error);

    throw new ErrorResponse('Failed to create document embeddings', 500);
  }

  return document;
};

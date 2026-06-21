import { prisma } from '../lib/prisma.js';
import { splitTextIntoChunks } from '../utils/textUtils.js';
import { extractKeywords } from '../utils/keywordUtils.js';
import { generateEmbedding } from './embeddingService.js';
import ErrorResponse from '../errors/errorResponse.js';

// create a document from text with chunks and embeddings
export const createDocumentFromText = async (title: string, text: string) => {
  const chunks = splitTextIntoChunks(text);

  // create initial document without embeddings
  const document = await prisma.document.create({
    data: {
      title: title.trim(),
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

  if (document.chunks.length === 0) {
    throw new ErrorResponse('No chunks were created', 400);
  }

  // generate embeddings for each chunk
  for (const chunk of document.chunks) {
    try {
      const embedding = await generateEmbedding(chunk.text);
      const vectorString = `[${embedding.join(',')}]`; // convert the embedding to a string that can be used in the SQL query for pgvector

      await prisma.$executeRaw`
        UPDATE "Chunk"
        SET "embedding" = ${vectorString}::vector
        WHERE "id" = ${chunk.id}
      `;
    } catch (error) {
      // delete the document if the chunk embedding update fails
      await prisma.document.delete({
        where: { id: document.id },
      });

      throw new ErrorResponse('Failed to create document embeddings', 500);
    }
  }

  return document;
};

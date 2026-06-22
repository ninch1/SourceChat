import { retrieveChunks } from './retrievalService.js';

// Service to ask a question using RAG

export const askRag = async (question: string) => {
  const retrievedChunks = await retrieveChunks(question, 3);

  if (retrievedChunks.length === 0) {
    return {
      answer: 'I could not find relevant information in the documents.',
      sources: [],
    };
  }

  const answer = retrievedChunks.map((chunk) => chunk.text).join('\n\n');
  const sources = retrievedChunks.map((chunk) => ({
    chunkId: chunk.chunkId,
    documentId: chunk.documentId,
    documentTitle: chunk.documentTitle,
    distance: chunk.distance,
    text: chunk.text,
  }));
  return { answer, sources };
};

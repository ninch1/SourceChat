import { retrieveChunks } from './retrievalService.js';
import type { RetrievedChunk } from './retrievalService.js';
import { generateAnswer } from './chatbotService.js';
import { hasChunks } from './chunkService.js';

// Service to ask a question using RAG

const formatSources = (sources: RetrievedChunk[]) => {
  return sources.map((source) => ({
    chunkId: source.chunkId,
    documentId: source.documentId,
    documentTitle: source.documentTitle,
    text: source.text,
    relevanceScore: Number((1 - source.distance).toFixed(3)),
  }));
};

export const askRag = async (question: string, userId: string) => {
  // TEMP diagnostic logs for production /api/ask 502 debugging — remove later

  // check if there are any uploaded chunks
  console.log('[ASK] checking for uploaded chunks');
  const hasUploadedChunks = await hasChunks(userId);
  console.log('[ASK] has uploaded chunks:', hasUploadedChunks);

  if (!hasUploadedChunks) {
    return {
      answer: 'No documents have been uploaded yet.',
      sources: [],
    };
  }

  // retrieve the chunks using cosine similarity
  const retrievedChunks = await retrieveChunks(question, userId, 3);

  if (retrievedChunks.length === 0) {
    return {
      answer: 'I could not find relevant information in the documents.',
      sources: [],
    };
  }

  // generate the answer
  console.log('[ASK] calling Gemini');
  const generatedAnswer = await generateAnswer(question, retrievedChunks);
  console.log('[ASK] Gemini response generated');

  const sources = generatedAnswer.answeredFromSources
    ? formatSources(retrievedChunks)
    : [];

  console.log('[ASK] sources prepared:', sources.length);

  return {
    answer: generatedAnswer.answer,
    sources,
  };
};

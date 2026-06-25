import { retrieveChunks } from './retrievalService.js';
import { generateAnswer } from './chatbotService.js';
import { hasChunks } from './chunkService.js';

// Service to ask a question using RAG

export const askRag = async (question: string, userId: string) => {
  // check if there are any uploaded chunks
  const hasUploadedChunks = await hasChunks(userId);
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
  const generatedAnswer = await generateAnswer(question, retrievedChunks);

  return {
    answer: generatedAnswer.answer,
    sources: generatedAnswer.answeredFromSources ? retrievedChunks : [],
  };
};

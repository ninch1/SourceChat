import { retrieveChunks } from './retrievalService.js';

export const askRag = async (question: string) => {
  const retrievedChunks = await retrieveChunks(question, 3);

  if (retrievedChunks.length === 0) {
    return {
      answer: 'I could not find relevant information in the documents.',
      sources: [],
    };
  }

  const answer = retrievedChunks.map((chunk) => chunk.chunk.text).join('\n\n');
  const sources = retrievedChunks.map((chunk) => ({
    id: chunk.chunk.id,
    title: chunk.chunk.title,
    score: chunk.score,
    matchedKeywords: chunk.matchedKeywords,
  }));
  return { answer, sources };
};

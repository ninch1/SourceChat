import { retrieveChunks } from './retrievalService.js';
import { generateAnswer } from './chatbotService.js';

// Service to ask a question using RAG

export const askRag = async (question: string) => {
  const retrievedChunks = await retrieveChunks(question, 3);

  if (retrievedChunks.length === 0) {
    return {
      answer: 'I could not find relevant information in the documents.',
      sources: [],
    };
  }

  const generatedAnswer = await generateAnswer(question, retrievedChunks);

  return {
    answer: generatedAnswer.answer,
    sources: generatedAnswer.answeredFromSources ? retrievedChunks : [],
  };
};

import { GoogleGenAI } from '@google/genai';
import type { RetrievedChunk } from './retrievalService.js';
import { z } from 'zod';

// Service to generate an answer using the Gemini API

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined');
}

const ai = new GoogleGenAI({ apiKey });

const GeminiAnswerSchema = z.object({
  answer: z.string(),
  answeredFromSources: z.boolean(),
});

type GeneratedAnswer = z.infer<typeof GeminiAnswerSchema>;

export const generateAnswer = async (
  question: string,
  sources: RetrievedChunk[],
): Promise<GeneratedAnswer> => {
  const prompt = `
    You are a helpful assistant that answers questions using only the provided sources.
    
    Rules:
    - Use only the sources below.
    - If the sources contain enough information, answer the question.
    - If the sources do not contain enough information, use exactly this answer:
      "The documents do not contain the information to answer the question."
    - Return only valid JSON.
    - Do not wrap the JSON in markdown.
    - Do not include any extra text.
    
    Return this shape:
    {
      "answer": "string",
      "answeredFromSources": boolean
    }
    
    Question:
    ${question}
    
    Sources:
    ${sources
      .map(
        (source, index) => `
    Source ${index + 1}:
    ${source.text}`,
      )
      .join('\n')}
    `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  if (!response.text) {
    throw new Error('Gemini did not return an answer');
  }

  const parsedJson = JSON.parse(response.text);
  const validatedAnswer = GeminiAnswerSchema.parse(parsedJson);

  return validatedAnswer;
};

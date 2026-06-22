import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import ErrorResponse from '../errors/errorResponse.js';
import type { RetrievedChunk } from './retrievalService.js';

// Service to generate an answer using the Gemini API

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

if (!apiKey) {
  throw new ErrorResponse('GEMINI_API_KEY is not defined', 500);
}

const ai = new GoogleGenAI({ apiKey });

// Validate the JSON shape we ask Gemini to return.
const GeminiAnswerSchema = z.object({
  answer: z.string(),
  answeredFromSources: z.boolean(),
});

type GeneratedAnswer = z.infer<typeof GeminiAnswerSchema>;

// Clean the text from the Gemini API response to remove the markdown code block
const cleanGeminiJsonText = (text: string): string => {
  return text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
};

const parseGeminiAnswer = (text: string): GeneratedAnswer => {
  try {
    const cleanedText = cleanGeminiJsonText(text);
    const parsedJson = JSON.parse(cleanedText);
    const result = GeminiAnswerSchema.safeParse(parsedJson);

    if (!result.success) {
      console.error(
        'Gemini response did not match expected answer shape:',
        parsedJson,
      );
      console.error('Error details:', result.error.issues);

      throw new ErrorResponse('AI service returned an invalid response.', 502);
    }

    return result.data;
  } catch (error) {
    if (error instanceof ErrorResponse) {
      throw error;
    }

    console.error('Failed to parse Gemini response:', text);

    throw new ErrorResponse('AI service returned an invalid response.', 502);
  }
};

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

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    if (!response.text) {
      throw new ErrorResponse('AI service returned an empty response.', 502);
    }

    return parseGeminiAnswer(response.text);
  } catch (error) {
    if (error instanceof ErrorResponse) {
      throw error;
    }

    console.error('Unexpected Gemini API error:', error);

    throw new ErrorResponse('AI service failed. Please try again later.', 502);
  }
};

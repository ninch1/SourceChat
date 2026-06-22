import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined');
}

const ai = new GoogleGenAI({ apiKey });

async function main() {
  const response = await ai.models.generateContent({
    model,
    contents: 'Explain RAG in one short paragraph.',
  });

  console.log(response.text);
}

main().catch((error) => {
  console.error('Gemini test failed:');

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});

import { prisma } from "../lib/prisma.js";
import { splitTextIntoChunks } from "../utils/textUtils.js";
import { extractKeywords } from "../utils/keywordUtils.js";

export const createDocumentFromText = async (title: string, text: string) => {
  const chunks = splitTextIntoChunks(text);

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

  return document;
};

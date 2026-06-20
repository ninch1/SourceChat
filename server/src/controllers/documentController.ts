import { asyncWrapper } from "../utils/asyncWrapper.js";
import ErrorResponse from "../errors/errorResponse.js";
import { splitTextIntoChunks } from "../utils/chunkMaker.js";
import { prisma } from "../lib/prisma.js";
import { extractKeywords } from "../utils/extractKeywords.js";

export const createDocument = asyncWrapper(async (req, res) => {
  const { title, text } = req.body ?? {};

  if (typeof title !== "string" || title.trim() === "") {
    throw new ErrorResponse("Title is required", 400);
  }

  if (typeof text !== "string" || text.trim() === "") {
    throw new ErrorResponse("Text is required", 400);
  }

  const chunks = splitTextIntoChunks(text);

  const document = await prisma.document.create({
    data: {
      title: title.trim(),
      chunks: {
        create: chunks.map((chunk) => ({
          text: chunk.trim(),
          keywords: extractKeywords(chunk),
        })),
      },
    },
    include: {
      chunks: true,
    },
  });

  res.status(201).json({
    message: "Document received successfully",
    document,
  });
});

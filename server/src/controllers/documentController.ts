import { asyncWrapper } from '../middleware/asyncWrapper.js';
import ErrorResponse from '../errors/errorResponse.js';
import { createDocumentFromText } from '../services/documentService.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import type { Prisma } from '../generated/prisma/client.js';
import { getAuthUser } from '../utils/authUtils.js';

const TitleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(100, 'Title must be less than 100 characters');
const TextSchema = z
  .string()
  .trim()
  .min(1, 'Text is required')
  .max(10000, 'Text must be less than 10000 characters');

const CreateDocumentSchema = z.object({
  title: TitleSchema,
  text: TextSchema,
});

// Schema for document id
const DocumentIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

type DocumentWithChunks = Prisma.DocumentGetPayload<{
  include: {
    chunks: true;
  };
}>;

type DocumentWithoutChunks = Prisma.DocumentGetPayload<{}>;

const safeDocument = (document: DocumentWithoutChunks) => {
  return {
    id: document.id,
    title: document.title,
    createdAt: document.createdAt,
  };
};

const safeDocumentWithChunks = (document: DocumentWithChunks) => {
  return {
    ...safeDocument(document),
    chunks: document.chunks.map((chunk) => ({
      id: chunk.id,
      text: chunk.text,
      keywords: chunk.keywords,
      createdAt: chunk.createdAt,
    })),
  };
};

// POST /api/documents - Create a new document from JSON body
export const createDocument = asyncWrapper(async (req, res) => {
  const user = getAuthUser(req);
  const { title, text } = CreateDocumentSchema.parse(req.body);

  const document = await createDocumentFromText(title, text, user.id);
  const safeDocumentData = safeDocumentWithChunks(document);
  res.status(201).json({
    success: true,
    message: 'Document created successfully',
    data: { document: safeDocumentData },
  });
});

// POST /api/documents/upload - Create a new document from file upload
export const uploadDocumentFile = asyncWrapper(async (req, res) => {
  const user = getAuthUser(req);
  const file = req.file;
  let title = req.body?.title;

  if (!file) {
    throw new ErrorResponse('File is required', 400);
  }

  if (file.mimetype !== 'text/plain') {
    throw new ErrorResponse('Only .txt files are supported', 400);
  }

  const text = file.buffer.toString('utf-8');

  if (!title) {
    title = file.originalname.split('.')[0];
  }

  const validatedTitle = TitleSchema.parse(title);
  const validatedText = TextSchema.parse(text);

  const document = await createDocumentFromText(
    validatedTitle,
    validatedText,
    user.id,
  );

  const safeDocumentData = safeDocumentWithChunks(document);
  res.status(201).json({
    success: true,
    message: 'Document uploaded successfully',
    data: { document: safeDocumentData },
  });
});

// GET /api/documents - Get all documents
export const getDocuments = asyncWrapper(async (req, res) => {
  const user = getAuthUser(req);
  const documents = await prisma.document.findMany({
    where: {
      userId: user.id,
    },
  });

  const safeDocumentsData = documents.map((document) => safeDocument(document));
  res.status(200).json({
    success: true,
    message: 'Documents fetched successfully',
    data: { documents: safeDocumentsData },
  });
});

// GET /api/documents/:id - Get a document by id
// will not return the embeddings
export const getDocumentById = asyncWrapper(async (req, res) => {
  const user = getAuthUser(req);
  const { id } = DocumentIdSchema.parse(req.params);

  const document = await prisma.document.findFirst({
    where: { id, userId: user.id },
    include: { chunks: true },
  });

  if (!document) {
    throw new ErrorResponse('Document not found', 404);
  }

  const safeDocumentData = safeDocumentWithChunks(document);
  res.status(200).json({
    success: true,
    message: 'Document fetched successfully',
    data: { document: safeDocumentData },
  });
});

// DELETE /api/documents/:id - Delete a document by id
export const deleteDocumentById = asyncWrapper(async (req, res) => {
  const user = getAuthUser(req);
  const { id } = DocumentIdSchema.parse(req.params);

  const document = await prisma.document.findFirst({
    where: { id, userId: user.id },
  });

  if (!document) {
    throw new ErrorResponse('Document not found', 404);
  }

  await prisma.document.delete({
    where: { id: document.id },
  });

  const safeDocumentData = safeDocument(document);
  res.status(200).json({
    success: true,
    message: 'Document deleted successfully',
    data: { document: safeDocumentData },
  });
});

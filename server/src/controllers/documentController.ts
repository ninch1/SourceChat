import { asyncWrapper } from '../middleware/asyncWrapper.js';
import ErrorResponse from '../errors/errorResponse.js';
import { createDocumentFromText } from '../services/documentService.js';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

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

// POST /api/documents - Create a new document from JSON body
export const createDocument = asyncWrapper(async (req, res) => {
  const { title, text } = CreateDocumentSchema.parse(req.body);

  const document = await createDocumentFromText(title, text);
  res.status(201).json({
    success: true,
    message: 'Document created successfully',
    data: { document },
  });
});

// POST /api/documents/upload - Create a new document from file upload
export const uploadDocumentFile = asyncWrapper(async (req, res) => {
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

  const document = await createDocumentFromText(validatedTitle, validatedText);

  res.status(201).json({
    success: true,
    message: 'Document uploaded successfully',
    data: { document },
  });
});

// GET /api/documents - Get all documents
export const getDocuments = asyncWrapper(async (req, res) => {
  const documents = await prisma.document.findMany();
  res.status(200).json({
    success: true,
    message: 'Documents fetched successfully',
    data: { documents },
  });
});

// GET /api/documents/:id - Get a document by id
// will not return the embeddings
export const getDocumentById = asyncWrapper(async (req, res) => {
  const { id } = DocumentIdSchema.parse(req.params);

  const document = await prisma.document.findUnique({
    where: { id },
    include: { chunks: true },
  });

  if (!document) {
    throw new ErrorResponse('Document not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Document fetched successfully',
    data: { document },
  });
});

// DELETE /api/documents/:id - Delete a document by id
export const deleteDocumentById = asyncWrapper(async (req, res) => {
  const { id } = DocumentIdSchema.parse(req.params);

  const document = await prisma.document.findUnique({
    where: { id },
  });

  if (!document) {
    throw new ErrorResponse('Document not found', 404);
  }

  await prisma.document.delete({
    where: { id },
  });

  res.status(200).json({
    success: true,
    message: 'Document deleted successfully',
    data: { document },
  });
});

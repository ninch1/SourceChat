import { asyncWrapper } from '../utils/asyncWrapper.js';
import ErrorResponse from '../errors/errorResponse.js';
import { createDocumentFromText } from '../services/documentService.js';
import { z } from 'zod';

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

// POST /api/documents - Create a new document from JSON body
export const createDocument = asyncWrapper(async (req, res) => {
  const { title, text } = CreateDocumentSchema.parse(req.body);

  const document = await createDocumentFromText(title, text);
  res.status(201).json({ message: 'Document created successfully', document });
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
    message: 'Document received successfully',
    document,
  });
});

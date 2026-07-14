import { Router } from 'express';
import {
  createDocument,
  uploadDocumentFile,
  getDocuments,
  getDocumentById,
  deleteDocumentById,
  updateDocumentById,
  deleteAllDocuments,
} from '../controllers/documentController.js';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware.js';
import { aiRateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 } });

router.post('/', authMiddleware, aiRateLimiter, createDocument);
router.post(
  '/upload',
  authMiddleware,
  aiRateLimiter,
  upload.single('file'),
  uploadDocumentFile,
);
router.get('/', authMiddleware, getDocuments);
// DELETE / must be registered before DELETE /:id so "/documents" is not treated as an id.
router.delete('/', authMiddleware, deleteAllDocuments);
router.get('/:id', authMiddleware, getDocumentById);
router.patch('/:id', authMiddleware, updateDocumentById);
router.delete('/:id', authMiddleware, deleteDocumentById);

export default router;

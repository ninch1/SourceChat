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

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 } });

router.post('/', authMiddleware, createDocument);
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  uploadDocumentFile,
);
router.get('/', authMiddleware, getDocuments);
router.delete('/all', authMiddleware, deleteAllDocuments);
router.get('/:id', authMiddleware, getDocumentById);
router.patch('/:id', authMiddleware, updateDocumentById);
router.delete('/:id', authMiddleware, deleteDocumentById);

export default router;

import { Router } from 'express';
import {
  createDocument,
  uploadDocumentFile,
  getDocuments,
  getDocumentById,
  deleteDocumentById,
} from '../controllers/documentController.js';
import multer from 'multer';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 } });

router.post('/', createDocument);

router.post('/upload', upload.single('file'), uploadDocumentFile);

router.get('/', getDocuments);

router.get('/:id', getDocumentById);

router.delete('/:id', deleteDocumentById);

export default router;

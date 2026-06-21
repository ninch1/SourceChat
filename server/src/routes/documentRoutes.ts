import { Router } from 'express';
import {
  createDocument,
  uploadDocumentFile,
} from '../controllers/documentController.js';
import multer from 'multer';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 } });

router.post('/create', createDocument);

router.post('/upload', upload.single('file'), uploadDocumentFile);

export default router;

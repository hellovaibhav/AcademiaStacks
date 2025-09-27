import express from 'express';
import {
  upload,
  uploadMaterial,
  uploadMaterialValidation,
  getUploadStats,
  deleteUploadedMaterial,
  parseFormData,
  checkUploadStatus
} from '../controllers/upload.js';
import {verifyToken} from '../utils/verifyToken.js';

const router = express.Router();

// SECURITY: Upload material (Authenticated users only)
router.post('/material',
  verifyToken,
  upload.single('pdfFile'),
  parseFormData,
  uploadMaterialValidation,
  uploadMaterial
);

// SECURITY: Get upload statistics (Authenticated users only)
router.get('/stats', verifyToken, getUploadStats);

// SECURITY: Delete uploaded material (Authenticated users only)
router.delete('/material/:materialId', verifyToken, deleteUploadedMaterial);

// Check upload status and configuration (Public endpoint for debugging)
router.get('/status', checkUploadStatus);

export default router;

import express from 'express';
import {
  createMaterial,
  deleteMaterial,
  getMaterial,
  getMaterialByType,
  getMaterials,
  updateMaterial,
  upvoteMaterial,
  createMaterialValidation,
  materialIdValidation,
  materialTypeValidation,
  upvoteValidation
} from '../controllers/material.js';
import {verifyToken, verifyAdmin} from '../utils/verifyToken.js';
import Material from '../models/Material.js';

const router = express.Router();

// SECURITY: Create new material (Admin only)
router.post('/', createMaterialValidation, verifyAdmin, createMaterial);

// SECURITY: Update the uploaded material (Admin only)
router.put('/:materialType/:id', materialTypeValidation, materialIdValidation, verifyAdmin, updateMaterial);

// SECURITY: Delete a selected material (Admin only)
router.delete('/:materialType/:id', materialTypeValidation, materialIdValidation, verifyAdmin, deleteMaterial);

// SECURITY: Get a particular material (Public with validation)
router.get('/:materialType/:id', materialTypeValidation, materialIdValidation, getMaterial);

// SECURITY: Get all materials (Public with pagination)
router.get('/', getMaterials);

// SECURITY: Get materials by type (Public with validation)
router.get('/:materialType', materialTypeValidation, getMaterialByType);

// SECURITY: Upvote material (Authenticated users only)
router.post('/upvote', upvoteValidation, verifyToken, upvoteMaterial);

// SECURITY: Proxy PDF requests to avoid CORS issues
router.get('/pdf-proxy/:materialId', async (req, res) => {
  try {
    const {materialId} = req.params;
    const material = await Material.findById(materialId);

    if (!material) {
      return res.status(404).json({error: 'Material not found'});
    }

    // Convert Google Drive URL to direct view URL
    let pdfUrl = material.materialLink;
    if (pdfUrl.includes('drive.google.com/file/d/')) {
      const fileId = pdfUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      if (fileId) {
        pdfUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }

    // Set appropriate headers for PDF viewing
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

    // For now, redirect to the Google Drive URL
    // In production, you might want to proxy the actual content
    res.redirect(pdfUrl);
  } catch (error) {
    console.error('PDF proxy error:', error);
    res.status(500).json({error: 'Failed to load PDF'});
  }
});

export default router;
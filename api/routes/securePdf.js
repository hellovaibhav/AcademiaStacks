import express from 'express';
import {verifyToken} from '../utils/verifyToken.js';
import Material from '../models/Material.js';
import {createSecureStream} from '../utils/pdfSecurity.js';

const router = express.Router();

// Get secure PDF stream
router.get('/secure-pdf/:id', verifyToken, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Check user subscription status here if needed
    // const user = req.user;
    // if (!user.isSubscribed) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Subscription required'
    //   });
    // }

    // Create a secure stream of the PDF
    const secureStream = await createSecureStream(material.file);
    
    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Pipe the secure stream to response
    secureStream.pipe(res);
  } catch (error) {
    console.error('Error serving secure PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error serving PDF'
    });
  }
});

export default router;
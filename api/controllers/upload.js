import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {body, validationResult} from 'express-validator';
import {createError} from '../utils/error.js';
// Removed Gozunga integration - using local storage only
import Material from '../models/Material.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {recursive: true});
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow only PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

export {parseFormData};

/**
 * Check upload status and configuration
 */
export const checkUploadStatus = async (req, res) => {
  try {
    const fs = await import('fs');
    const path = await import('path');

    // Check if uploads directory exists
    const uploadsDir = './uploads';
    const materialsDir = './uploads/materials';

    const status = {
      storage: {
        type: 'local',
        status: 'active'
      },
      localStorage: {
        uploadsDir: fs.existsSync(uploadsDir),
        materialsDir: fs.existsSync(materialsDir),
        path: materialsDir
      },
      files: []
    };

    // List uploaded files if materials directory exists
    if (fs.existsSync(materialsDir)) {
      try {
        const files = fs.readdirSync(materialsDir);
        status.files = files.map(file => ({
          name: file,
          size: fs.statSync(path.join(materialsDir, file)).size,
          type: file.endsWith('.pdf') ? 'PDF' : 'Thumbnail'
        }));
      } catch {
        status.files = [];
      }
    }

    res.json({
      success: true,
      status
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to check upload status',
      error: error.message
    });
  }
};

// Validation schema for material upload
export const uploadMaterialValidation = [
  body('subject').trim().isLength({min: 2, max: 100}).withMessage('Subject must be between 2 and 100 characters'),
  body('semester').isInt({min: 1, max: 8}).withMessage('Semester must be between 1 and 8'),
  body('instructorName').isArray({min: 1}).withMessage('At least one instructor name is required'),
  body('instructorName.*').trim().isLength({min: 2, max: 50}).withMessage('Instructor name must be between 2 and 50 characters'),
  body('desc').optional().trim().isLength({max: 500}).withMessage('Description cannot exceed 500 characters'),
  body('author').isArray({min: 1}).withMessage('At least one author is required'),
  body('author.*').trim().isLength({min: 2, max: 50}).withMessage('Author name must be between 2 and 50 characters'),
  body('yearOfWriting').isInt({min: 2000, max: new Date().getFullYear()}).withMessage('Year must be valid'),
  body('branch').isArray({min: 1}).withMessage('At least one branch is required'),
  body('materialType').trim().isLength({min: 2, max: 50}).withMessage('Material type is required'),
  body('courseCode').optional().trim().isLength({max: 20}).withMessage('Course code cannot exceed 20 characters'),
  body('contributedBy').optional().trim().isLength({max: 100}).withMessage('Contributor name cannot exceed 100 characters')
];

/**
 * Parse JSON string fields from form data
 */
const parseFormData = (req, res, next) => {
  try {
    // Parse JSON string fields
    if (req.body.instructorName && typeof req.body.instructorName === 'string') {
      req.body.instructorName = JSON.parse(req.body.instructorName);
    }
    if (req.body.author && typeof req.body.author === 'string') {
      req.body.author = JSON.parse(req.body.author);
    }
    if (req.body.branch && typeof req.body.branch === 'string') {
      req.body.branch = JSON.parse(req.body.branch);
    }
    next();
  } catch {
    return next(createError(400, 'Invalid JSON format in form data'));
  }
};

/**
 * Upload material with PDF file
 */
export const uploadMaterial = async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    // Check if file was uploaded
    if (!req.file) {
      return next(createError(400, 'PDF file is required'));
    }

    const file = req.file;
    const {
      subject,
      semester,
      instructorName,
      courseCode,
      desc,
      author,
      yearOfWriting,
      branch,
      materialType,
      contributedBy
    } = req.body;

    // Parse array fields
    const instructorNames = Array.isArray(instructorName) ? instructorName : [instructorName];
    const authors = Array.isArray(author) ? author : [author];
    const branches = Array.isArray(branch) ? branch : [branch];

    // Use original file path (PDF compression removed)
    const compressedPath = file.path;

    // Generate thumbnail using local processing
    const thumbnailPath = file.path.replace('.pdf', '_thumb.png');
    const thumbnailSuccess = false; // Disabled for now

    // Upload PDF to local storage
    const pdfFileName = `${subject.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
    let materialLink;
    let driveFileId;
    let fileSize;

    console.log('📁 Uploading PDF to local storage...');
    const localUploadDir = './uploads/materials';
    if (!fs.existsSync(localUploadDir)) {
      fs.mkdirSync(localUploadDir, {recursive: true});
      console.log('📁 Created local uploads directory');
    }

    const localFilePath = path.join(localUploadDir, pdfFileName);
    fs.copyFileSync(compressedPath, localFilePath);
    console.log('📁 PDF copied to local storage:', localFilePath);

    // Get file stats for size
    const stats = fs.statSync(localFilePath);
    fileSize = stats.size;

    materialLink = `/uploads/materials/${pdfFileName}`;
    driveFileId = `local_${Date.now()}`;
    console.log('✅ PDF uploaded to local storage successfully');

    // Thumbnail generation disabled
    let thumbnailUrl = '';

    // Create material record
    const newMaterial = new Material({
      subject,
      semester: parseInt(semester, 10),
      instructorName: instructorNames,
      courseCode: courseCode || '',
      materialLink: materialLink,
      desc: desc || '',
      author: authors,
      yearOfWriting: parseInt(yearOfWriting, 10),
      branch: branches,
      materialType,
      thumbnail: thumbnailUrl,
      featured: false,
      contributedBy: contributedBy || 'User',
      verifiedBy: 'pending',
      upvotes: [],
      driveFileId: driveFileId, // Store file ID (Gozunga or local)
      driveThumbnailId: thumbnailSuccess ? thumbnailPath.split('_thumb.png')[0].split('/').pop() : null,
      fileSize: fileSize
    });

    const savedMaterial = await newMaterial.save();

    // Clean up temporary files
    try {
      fs.unlinkSync(file.path);
      fs.unlinkSync(compressedPath);
      if (thumbnailSuccess) {
        fs.unlinkSync(thumbnailPath);
      }
    } catch (cleanupError) {
      console.warn('Failed to clean up temporary files:', cleanupError);
    }

    res.status(201).json({
      success: true,
      message: 'Material uploaded successfully',
      material: savedMaterial,
      storage: {
        type: 'local',
        path: materialLink
      }
    });

  } catch {
    console.error('Upload error:', error);

    // Clean up files on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn('Failed to clean up file on error:', cleanupError);
      }
    }

    next(createError(500, 'Failed to upload material'));
  }
};

/**
 * Get upload status and statistics
 */
export const getUploadStats = async (req, res, next) => {
  try {
    const totalMaterials = await Material.countDocuments();
    const pendingMaterials = await Material.countDocuments({verifiedBy: 'pending'});
    const verifiedMaterials = await Material.countDocuments({verifiedBy: {$ne: 'pending'}});

    res.json({
      success: true,
      stats: {
        total: totalMaterials,
        pending: pendingMaterials,
        verified: verifiedMaterials
      }
    });
  } catch {
    next(createError(500, 'Failed to get upload statistics'));
  }
};

/**
 * Delete uploaded material
 */
export const deleteUploadedMaterial = async (req, res, next) => {
  try {
    const {materialId} = req.params;

    const material = await Material.findById(materialId);
    if (!material) {
      return next(createError(404, 'Material not found'));
    }

    // Delete from Gozunga if file ID exists
    if (material.driveFileId) {
      // File stored locally, no additional cleanup needed
    }

    // Delete from database
    await Material.findByIdAndDelete(materialId);

    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch {
    next(createError(500, 'Failed to delete material'));
  }
};

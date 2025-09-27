import express from 'express';
import {
  getUserUploadedMaterials,
  getUserUpvotedMaterials,
  getUserSavedMaterials,
  getUserProfileStats
} from '../controllers/userProfile.js';
import {verifyToken} from '../utils/verifyToken.js';
import {param, query} from 'express-validator';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Validation middleware
const validateUserId = [
  param('userId').isMongoId().withMessage('Invalid user ID')
];

const validatePagination = [
  query('page').optional().isInt({min: 1}).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({min: 1, max: 100}).withMessage('Limit must be between 1 and 100')
];

// Get user profile statistics
router.get('/:userId/stats', validateUserId, getUserProfileStats);

// Get user's uploaded materials
router.get('/:userId/uploaded', validateUserId, validatePagination, getUserUploadedMaterials);

// Get user's upvoted materials
router.get('/:userId/upvoted', validateUserId, validatePagination, getUserUpvotedMaterials);

// Get user's saved materials
router.get('/:userId/saved', validateUserId, validatePagination, getUserSavedMaterials);

export default router;

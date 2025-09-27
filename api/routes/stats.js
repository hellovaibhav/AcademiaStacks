import express from 'express';
import {getPlatformStats, getGitHubStats} from '../controllers/stats.js';

const router = express.Router();

// Public routes - no authentication required
router.get('/platform', getPlatformStats);
router.get('/github', getGitHubStats);

export default router;

import express from 'express';
import {createFeedback} from '../controllers/feedback.js';

const router = express.Router();

router.post('/', createFeedback);

export default router;
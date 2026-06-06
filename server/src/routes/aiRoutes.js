import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { analyzeResume } from '../controllers/aiController.js';

const router = express.Router();

router.post("/resume-review", authMiddleware, analyzeResume);

export default router;
import express from 'express';
import { createNewSession,refineComponent } from '../controllers/sessionController.js';
import {authenticateToken} from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/newSession', authenticateToken, createNewSession);
router.post('/refineComponent/:sessionId', authenticateToken, refineComponent);
export default router;

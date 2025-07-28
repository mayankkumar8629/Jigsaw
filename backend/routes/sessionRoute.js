import express from 'express';
import { createNewSession,refineComponent,getAllSessions,getSessionById} from '../controllers/sessionController.js';
import {authenticateToken} from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/newSession', authenticateToken, createNewSession);
router.post('/refineComponent/:sessionId', authenticateToken, refineComponent);
router.get('/allSessions',authenticateToken, getAllSessions);
router.get('/:sessionId', authenticateToken, getSessionById);
export default router;

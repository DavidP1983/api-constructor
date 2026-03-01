import Router from 'express';
import TestAccessLinkController from '../controllers/TestAccessLinkController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = new Router();

const { createLink, getTest } = TestAccessLinkController;

router.post('/get-link/:id', authMiddleware, createLink);
router.get('/get-test/:id', getTest);



export default router;
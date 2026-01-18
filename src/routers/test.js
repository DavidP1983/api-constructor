import Router from 'express';
const router = new Router();

import testController from '../controllers/TestController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const {
    getTestsByQueryParams,
    createTest,
    getPublicTests,
    getTestsByID,
    updateTest,
    deleteTest
} = testController;

router.get('/get', authMiddleware, getTestsByQueryParams);
router.post('/create', authMiddleware, createTest);
router.patch('/update', authMiddleware, updateTest);
router.delete('/delete/:id', authMiddleware, deleteTest);
router.get('/get/public', getPublicTests);
router.get('/get/public/:id', getTestsByID);

export default router;
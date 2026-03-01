import Router from 'express';
const router = new Router();

import testController from '../controllers/TestController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { cache } from '../middleware/cacheMiddleware.js';

const {
    getTestsByQueryParams,
    createTest,
    getPublicTests,
    getTestsByID,
    updateTest,
    deleteTest
} = testController;

// Redis key for test operation
export const fabricKey = {
    admin: 'tests:Admin:all',
    user: (id) => {
        return `tests:User:${id}`;
    }
};

router.get('/get', authMiddleware, cache((req) => {
    const { id, role } = req.user;
    const { q } = req?.query;
    const key = role === 'Admin' ? fabricKey.admin : fabricKey.user(id);
    return {
        key,
        query: q
    };

}, 120), getTestsByQueryParams);

router.post('/create', authMiddleware, createTest);
router.patch('/update', authMiddleware, updateTest);
router.delete('/delete/:id', authMiddleware, deleteTest);
router.get('/get/public', getPublicTests); // Приводит к проблема на GitHub-Actions при CI, временно не используется
router.get('/get/public/:id', getTestsByID);

export default router;
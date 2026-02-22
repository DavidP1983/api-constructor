import Router from 'express';
const router = new Router();

import completedTestController from '../controllers/CompletedTestController.js';
import { cache } from '../middleware/cacheMiddleware.js';

const {
    createCompletedTest,
    getCompletedTest,
    getCompletedTestResult,
    deleteCompletedTest
} = completedTestController;


// Redis key for Completed Tests
export const completedTestKey = {
    completedTest: (id) => (`completedTest:${id}`),
    completedTestResult: (id) => (`completedTestResult:${id}`)
};

router.post('/create-completed-test', createCompletedTest);

router.get('/get-completed-test/:id', cache((req) => {
    const authorId = req.params.id;
    return {
        key: completedTestKey.completedTest(authorId),
        query: ''
    };
}, 120), getCompletedTest);

router.get('/get-completed-result-test/:id', cache((req) => {
    const testId = req.params.id;
    return {
        key: completedTestKey.completedTestResult(testId),
        query: ''
    };
}, 120), getCompletedTestResult);

router.delete('/delete-completed-test/:id', deleteCompletedTest);

export default router;
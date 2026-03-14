import Router from 'express';
import completedTestController from '../controllers/CompletedTestController.js';
import { cache } from '../middleware/cacheMiddleware.js';
import { mongoMiddleware } from '../middleware/mongoMiddleware.js';

const router = new Router();
router.use(mongoMiddleware);

const {
    createCompletedTest,
    getCompletedTest,
    getCompletedTestResult,
    deleteCompletedTest,
    sendNotificationEmail
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
router.post('/send-notification-email', sendNotificationEmail);

export default router;
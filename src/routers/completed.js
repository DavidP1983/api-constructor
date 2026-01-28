import Router from 'express';
const router = new Router();

import completedTestController from '../controllers/CompletedTestController.js';

const {
    createCompletedTest,
    getCompletedTest,
    getCompletedTestResult,
    deleteCompletedTest
} = completedTestController;

router.post('/create-completed-test', createCompletedTest);
router.get('/get-completed-test/:id', getCompletedTest);
router.get('/get-completed-result-test/:id', getCompletedTestResult);
router.delete('/delete-completed-test/:id', deleteCompletedTest);

export default router;
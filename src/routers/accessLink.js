import Router from 'express';
import TestAccessLinkController from '../controllers/TestAccessLinkController.js';
const router = new Router();

const { createLink, getTest } = TestAccessLinkController;

router.post('/get-link/:id', createLink);
router.get('/get-test/:id', getTest);



export default router;
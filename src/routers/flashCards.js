import Router from 'express';
import flashCardsController from '../controllers/FlashCardsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { mongoMiddleware } from '../middleware/mongoMiddleware.js';

const router = new Router();
router.use(mongoMiddleware);

const {
    getFolders,
    createFolder
} = flashCardsController;


router.get('/get-folders', authMiddleware, getFolders);
router.post('/create-folder', authMiddleware, createFolder);

export default router;
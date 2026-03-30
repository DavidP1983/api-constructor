import Router from 'express';
import flashCardsController from '../controllers/FlashCardsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { mongoMiddleware } from '../middleware/mongoMiddleware.js';

const router = new Router();
router.use(mongoMiddleware);

const {
    getFolders,
    createFolder,
    getFolderById,
    deleteFolderById,
    updateFolderById,
    createCardById,
    updateCardById,
    deleteCardById,
    updateCardStatus
} = flashCardsController;

router.get('/get-folders', authMiddleware, getFolders);
router.post('/create-folder', authMiddleware, createFolder);
router.get('/get-folder/:id', getFolderById);
router.get('/study/:id', getFolderById);
router.delete('/delete-folder/:id', authMiddleware, deleteFolderById);
router.patch('/update-folder/:id', authMiddleware, updateFolderById);
router.patch('/create-card/:id', authMiddleware, createCardById);
router.patch('/update-card/:folderId/card/:cardId', authMiddleware, updateCardById);
router.delete('/delete-card/:folderId/card/:cardId', authMiddleware, deleteCardById);
router.patch('/update-card-status/:id/', authMiddleware, updateCardStatus);

export default router;


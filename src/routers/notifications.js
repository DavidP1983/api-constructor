import Router from 'express';
const router = new Router();

import notificationUserController from '../controllers/NotificationUserController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const {
    sendAdminNotifications,
    getNotification,
    readNotification
} = notificationUserController;

router.post('/admin-warning', sendAdminNotifications);
router.get('/get-notification', authMiddleware, getNotification);
router.patch('/read-notification', authMiddleware, readNotification);


export default router;


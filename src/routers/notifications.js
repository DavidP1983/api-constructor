import Router from 'express';
const router = new Router();

import notificationUserController from '../controllers/NotificationUserController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const {
    sendAdminNotifications,
    getNotification,
    markNotificationAsRead
} = notificationUserController;

router.post('/send-notification', sendAdminNotifications);
router.get('/get-notification', authMiddleware, getNotification);
router.patch('/mark-read', authMiddleware, markNotificationAsRead);


export default router;


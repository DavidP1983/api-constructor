import Router from 'express';
import notificationUserController from '../controllers/NotificationUserController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { mongoMiddleware } from '../middleware/mongoMiddleware.js';

const router = new Router();
router.use(mongoMiddleware);

const {
    sendAdminNotifications,
    getNotification,
    markNotificationAsRead
} = notificationUserController;

router.post('/send-notification', sendAdminNotifications);
router.get('/get-notification', authMiddleware, getNotification);
router.patch('/mark-read', authMiddleware, markNotificationAsRead);


export default router;


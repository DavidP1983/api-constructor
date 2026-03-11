import { ApiError } from "../exceptions/apiError.js";
import NotificationUserServices from "../services/NotificationUserServices.js";

class NotificationUserController {

    async sendAdminNotifications(req, res, next) {
        try {
            const { userId, message } = req.body;
            if (!userId || !message) {
                throw new ApiError.badRequest(400, 'Invalid data in send admin notification');
            }
            await NotificationUserServices.sendNotifications(userId, message);
            res.status(200).json({ success: true });
        } catch (e) {
            next(e);
        }
    }

    async getNotification(req, res, next) {
        try {
            const id = req.user.id;
            if (!id) {
                throw new ApiError.badRequest(400, 'Invalid data in get notification');
            }
            const data = await NotificationUserServices.getUserNotification(id);
            res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    async readNotification(req, res, next) {
        try {
            const id = req.user.id;
            console.log('READ', id);
            if (!id) {
                throw new ApiError.badRequest(400, 'Invalid data in Read Notification');
            }
            await NotificationUserServices.readUserNotification(id);
            res.status(200).json({ success: true });
        } catch (e) {
            next(e);
        }
    }
}

export default new NotificationUserController();
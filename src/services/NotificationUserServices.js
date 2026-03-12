import { format } from 'date-fns';
import { ApiError } from '../exceptions/apiError.js';
import { User } from "../model/Users.js";


class NotificationUserServices {

    async sendNotifications(userId, message) {
        const date = format(new Date(), "yyyy-MM-dd");
        const result = await User.updateOne(
            { _id: userId },
            {
                $set: {
                    notifications: {
                        sender: 'Admin',
                        type: 'warning',
                        message,
                        isRead: false,
                        createdAt: date
                    }
                }
            }
        );
        if (result.matchedCount === 0) {
            throw new ApiError.notFound(404, 'User not found');
        }
    }

    async getUserNotification(_id) {
        const userData = await User.findById(_id).lean();
        if (!userData) {
            throw new ApiError.notFound(404, 'User not found');
        }
        if (userData.notifications?.isRead && Date.now() - new Date(userData.notifications?.createdAt).getTime() > 86400000) {
            await User.updateOne({ _id }, { $set: { notifications: null } });
        }
        return { notifications: userData.notifications };
    }

    async markAsRead(_id) {
        const userData = await User.updateOne({ _id }, { $set: { 'notifications.isRead': true } });

        if (userData.matchedCount === 0) {
            throw new ApiError.notFound(404, 'User not found');
        }
    }
}

export default new NotificationUserServices();

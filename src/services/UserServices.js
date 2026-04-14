import { format } from 'date-fns';
import sharp from 'sharp';
import { cleanupUserSession } from '../cache/cleanupUserSession.js';
import { PayloadDTO } from '../dto/payloadDTO.js';
import { UserDTO } from '../dto/userDTO.js';
import { ApiError } from '../exceptions/apiError.js';
import { redis } from '../lib/redis.js';
import { CompletedTest } from '../model/CompletedTest.js';
import { User } from '../model/Users.js';
import tokenServices from '../services/TokenServices.js';
import { sendMail } from '../utils/sendMail.js';
import testServices from './TestServices.js';


class UserService {

    async registration(name, email, password) {
        await User.registration(email);

        const date = format(new Date(new Date()), "yyyy-MM-dd");
        const data = {
            name,
            email,
            password,
            role: 'User',
            joined: date,
            notifications: null,
            lastActivity: date,
            avatar: null,
            isOnline: true
        };
        const user = new User(data);
        await user.save();

        const payloadDto = new PayloadDTO(user);
        const userDto = new UserDTO(user);
        const tokens = tokenServices.generateToken({ ...payloadDto });

        await tokenServices.saveToken(payloadDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }


    async login(email, password, ip) {
        const key = `login:${ip}`;

        // Redis Rate Time Limit
        // Делаем проверку до того, как запрос пойдет к DB
        const current = await redis.get(key);
        if (current && Number(current) >= 5) {
            throw ApiError.badRequest(429, 'Too many failed login attempts. Try again in 1 minute.');
        }

        try {
            const user = await User.findCredentials(email, password);
            const userDTO = new UserDTO(user);
            // Если все прошло успешно сбрасываем счетчик
            await redis.del(key);

            const code = Math.floor(1000 + Math.random() * 9000).toString();
            const existingCode = await redis.set(`2fa:${userDTO.id}`, code, { ex: 180, nx: true });
            if (!existingCode) {
                throw ApiError.badRequest(429, 'Code already sent. Please wait.');
            }

            const data = {
                email,
                code,
                source: 'verification'
            };

            await sendMail(data);
            return { requires2FA: true, user: userDTO };
        } catch (e) {
            // Если логин неуспешен устанавливаем счетчик
            await redis.incr(key);
            const ttl = await redis.ttl(key);
            if (ttl === -1) {
                await redis.expire(key, 60);
            }
            throw e;
        }
    }

    async verifyCode(inputCode, userId) {
        const REFRESH_TTL = 30 * 24 * 60 * 60;
        const key = `2fa:${userId}`;
        const savedCode = await redis.get(key);

        if (!savedCode || String(savedCode) !== String(inputCode)) {
            const ttl = await redis.ttl(key);
            const retryAfter = ttl > 0 ? ttl : 0;
            throw ApiError.badRequest(400, 'Code Invalid', { retryAfter });
        }
        await redis.del(key);

        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.badRequest(400, 'User not found');
        }

        const date = format(new Date(new Date()), "yyyy-MM-dd");

        user.lastLogin = user.lastActivity ?? null;
        user.lastActivity = date;
        user.isOnline = true;
        await user.save();

        const payloadDto = new PayloadDTO(user);
        const userDTO = new UserDTO(user);
        const token = tokenServices.generateToken({ ...payloadDto });
        await tokenServices.saveToken(payloadDto.id, token.refreshToken);

        // Сохраняем RefreshToken в Redis
        await redis.set(
            `refresh:${payloadDto.id}`,
            token.refreshToken,
            { ex: REFRESH_TTL },

        );

        return { ...token, user: userDTO };
    }


    async resendCode(userId, email) {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        await redis.set(`2fa:${userId}`, code, { ex: 180 });

        const data = {
            email,
            code,
            source: 'verification'
        };

        await sendMail(data);
        return { requires2FA: true };
    }


    async logout(refreshToken) {
        const tokenData = tokenServices.validateRefreshToken(refreshToken);
        if (tokenData) {
            // удаляем ключ refreshToken из Redis, а так же инвалидируем кеш тестов
            await cleanupUserSession(tokenData.id);
        }
        await User.findOneAndUpdate({ _id: tokenData.id }, { isOnline: false });
        const token = await tokenServices.removeToken(refreshToken);
        if (!token) {
            throw new Error('Token not found');
        }
        return true;
    }


    async update(_id, oldPassword, newPassword) {
        const user = await User.checkCredentials(_id, oldPassword);

        user.password = newPassword;
        await user.save();

        return user;
    }


    async delete(_id, password, refreshToken) {
        await User.checkCredentials(_id, password);


        try {
            await CompletedTest.deleteMany({ authorId: String(_id) });
        } catch (e) {
            throw ApiError.internal(500, "Error while deleting completed tests");
        }


        try {
            await testServices.deleteAllUserTests(_id);
        } catch (e) {
            throw ApiError.internal(500, "Error while deleting completed tests");
        }

        const deletedUser = await User.deleteOne({ _id });
        if (!deletedUser.deletedCount) {
            throw ApiError.notFound(404, 'User not found');
        }

        await tokenServices.removeToken(refreshToken);

        // Удаляем ключ refreshToken из Redis, а так же инвалидируем кеш тестов
        await cleanupUserSession(tokenData.id);

        return { success: true };
    }


    async refresh(refreshToken) {
        const REFRESH_TTL = 30 * 24 * 60 * 60;
        let isValidToken = false;
        console.log('refresh');

        const tokenData = tokenServices.validateRefreshToken(refreshToken);

        if (!tokenData) {
            throw ApiError.unauthorizeError();
        }

        // Redis проверка refreshToken
        const redisToken = await redis.get(`refresh:${tokenData.id}`);

        if (redisToken && redisToken === refreshToken) {
            console.log('REFRESH CACHED');
            isValidToken = true;
        } else {
            // Mongo fallback
            const mongoToken = await tokenServices.findToken(refreshToken);
            if (mongoToken) {
                isValidToken = true;

                await redis.set(
                    `refresh:${tokenData.id}`,
                    refreshToken,
                    { ex: REFRESH_TTL }
                );
            }
        }


        if (!isValidToken) {
            throw ApiError.unauthorizeError();
        }

        const user = await User.findById(tokenData.id).lean();
        if (!user) {
            throw ApiError.unauthorizedError();
        }
        const payloadDto = new PayloadDTO(user);
        const userDTO = new UserDTO(user);
        const token = tokenServices.generateToken({ ...payloadDto });
        await tokenServices.saveToken(payloadDto.id, token?.refreshToken);

        // Обновление rotation в Redis
        await redis.set(
            `refresh:${payloadDto.id}`,
            token.refreshToken,
            { ex: REFRESH_TTL }
        );

        return { ...token, user: userDTO };
    }


    async upload(file) {
        const buffer = await sharp(file).resize({ width: 100, height: 100 }).webp().toBuffer();
        return buffer;
    }


    async getImg(_id) {
        const user = await User.findById({ _id });
        if (!user || !user.avatar) {
            return null;
        }
        return user.avatar;
    }

    async getInfoAboutUsers() {

        const usersOnline = await User.countDocuments({ isOnline: true });
        const totalUsers = await User.countDocuments();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newUsers = await User.countDocuments({ createdAt: { $gte: today } });

        return { usersOnline, totalUsers, newUsers };
    }

    async sendFeedback(_id, data) {
        await sendMail(data);
        const res = await User.updateOne({ _id }, { $set: { feedbackSubmitted: true } });
        if (res.matchedCount === 0) {
            throw new ApiError.notFound(404, 'User not found');
        }
        return true;
    }
}

export default new UserService();


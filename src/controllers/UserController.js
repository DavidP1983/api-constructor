import { ApiError } from '../exceptions/apiError.js';
import userServices from '../services/UserServices.js';
import { COOKIE_OPTIONS, setAuthCookies } from '../utils/setAuthCookies.js';

class UserController {

    async registration(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const { user, accessToken, refreshToken } = await userServices.registration(name, email, password);

            setAuthCookies(res, accessToken, refreshToken);
            res.status(201).send(user);
        } catch (e) {
            next(e);
        }
    }


    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const ip = req.headers["x-forwarded-for"]?.split(',')[0] || req.socket.remoteAddress;
            const result = await userServices.login(email, password, ip);

            res.status(200).send(result);
        } catch (e) {
            next(e);
        }
    }


    async verification(req, res, next) {
        try {
            const { code, userId } = req.body;
            const { user, accessToken, refreshToken } = await userServices.verifyCode(code, userId);

            setAuthCookies(res, accessToken, refreshToken);
            res.status(200).send(user);
        } catch (e) {
            next(e);
        }
    }

    async resendCodeVerification(req, res, next) {
        try {
            const { userId, email } = req.body;
            const result = await userServices.resendCode(userId, email);
            res.status(200).send(result);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                throw ApiError.unauthorizeError();
            }

            await userServices.logout(refreshToken);
            res.clearCookie('refreshToken', COOKIE_OPTIONS);
            res.clearCookie('accessToken', COOKIE_OPTIONS);

            res.status(200).send({ message: 'Logged out' });
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                throw ApiError.unauthorizeError();
            }

            const token = await userServices.refresh(refreshToken);
            setAuthCookies(res, token?.accessToken, token?.refreshToken);
            res.status(200).send(token);
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            const updatedUser = await userServices.update(req.user.id, oldPassword, newPassword);
            res.status(200).send(updatedUser);
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { password } = req.body;
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                throw ApiError.unauthorizeError();
            }

            await userServices.delete(req.user.id, password, refreshToken);

            res.clearCookie('refreshToken', COOKIE_OPTIONS);
            res.clearCookie('accessToken', COOKIE_OPTIONS);

            res.status(200).send({ success: true });
        } catch (e) {
            next(e);
        }
    }


    async uploadFile(req, res, next) {
        try {
            const buffer = await userServices.upload(req.file.buffer);
            req.user.avatar = buffer;
            await req.user.save();
            res.status(200).send({ ok: true });
        } catch (e) {
            next(e);
        }
    }

    async getImage(req, res, next) {
        try {
            const avatar = await userServices.getImg(req.params.id);
            if (!avatar) return res.status(204).end();
            res.status(200).set({
                'Content-Type': 'image/webp',
                'Content-Length': avatar.length,
            }).end(avatar);
        } catch (e) {
            next(e);
        }
    }

    async getStats(req, res, next) {
        try {
            const role = req.user.role;
            if (role !== 'Admin') {
                throw new ApiError.forbidden(403, 'Forbidden get stats');
            }
            const stats = await userServices.getInfoAboutUsers();
            res.status(200).json(stats);
        } catch (e) {
            next(e);
        }
    }

    async submitFeedback(req, res, next) {
        try {
            const id = req.user.id;
            const data = req.body;
            if (!id) {
                throw new ApiError.unauthorizeError();
            }
            await userServices.sendFeedback(id, data);
            res.status(200).json({ success: true });
        } catch (e) {
            next(e);
        }
    }
}


export default new UserController();
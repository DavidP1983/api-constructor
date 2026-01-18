import userServices from '../services/UserServices.js';

class UserController {

    async registration(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const userData = await userServices.registration(name, email, password);

            res.status(201).send(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userServices.login(email, password);

            res.status(200).send(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            await userServices.logout(refreshToken);
            res.status(200).send({ message: 'Logged out' });
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
            const deletedAccount = await userServices.delete(req.user.id, password, req.cookies.refreshToken);
            res.status(200).send(deletedAccount);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userServices.refresh(refreshToken);
            res.status(200).send(token);
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
}

export default new UserController();
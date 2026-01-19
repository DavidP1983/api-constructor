import { format } from 'date-fns';
import sharp from 'sharp';
import { PayloadDTO } from '../dto/payloadDTO.js';
import { UserDTO } from '../dto/userDTO.js';
import { ApiError } from '../exceptions/apiError.js';
import { User } from '../model/Users.js';
import tokenServices from '../services/TokenServices.js';
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
            notifications: false,
            lastActivity: date,
            avatar: null
        };
        const user = new User(data);
        await user.save();

        const payloadDto = new PayloadDTO(user);
        const userDto = new UserDTO(user);
        const tokens = tokenServices.generateToken({ ...payloadDto });

        await tokenServices.saveToken(payloadDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }


    async login(email, password) {
        const user = await User.findCredentials(email, password);

        const date = format(new Date(new Date()), "yyyy-MM-dd");

        user.lastLogin = user.lastActivity ?? null;
        user.lastActivity = date;
        await user.save();

        const payloadDto = new PayloadDTO(user);
        const userDTO = new UserDTO(user);
        const token = tokenServices.generateToken({ ...payloadDto });
        await tokenServices.saveToken(payloadDto.id, token.refreshToken);
        return { ...token, user: userDTO };
    }


    async logout(refreshToken) {
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


        const deletedTests = await testServices.deleteAllUserTests(_id);
        if (!deletedTests) {
            throw ApiError.internal(404, "Failed to delete user tests");
        }

        const deletedUser = await User.deleteOne({ _id });
        if (!deletedUser.deletedCount) {
            throw ApiError.notFound(404, 'User not found');
        }

        await tokenServices.removeToken(refreshToken);

        return { success: true };
    }


    async refresh(refreshToken) {

        console.log('refresh');

        const tokenData = tokenServices.validateRefreshToken(refreshToken);
        const tokenDB = await tokenServices.findToken(refreshToken);

        if (!tokenData || !tokenDB) {
            throw ApiError.unauthorizeError();
        }

        const user = await User.findById(tokenData.id);
        if (!user) {
            throw ApiError.unauthorizedError();
        }
        const payloadDto = new PayloadDTO(user);
        const userDTO = new UserDTO(user);
        const token = tokenServices.generateToken({ ...payloadDto });
        await tokenServices.saveToken(payloadDto.id, token?.refreshToken);
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
}

export default new UserService();


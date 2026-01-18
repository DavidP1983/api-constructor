import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Token } from '../model/Token.js';
dotenv.config();


class TokenServices {

    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "2m" });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "60d" });
        return {
            accessToken,
            refreshToken
        };
    }

    async saveToken(userId, refreshToken) {
        const token = await Token.findOne({ userId });

        if (token) {
            token.refreshToken = refreshToken;
            return token.save();
        }

        const firstToken = new Token({ userId, refreshToken });
        await firstToken.save();
    }

    validateAccessToken(token) {
        try {
            const accessToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return accessToken;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const refreshToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return refreshToken;
        } catch (e) {
            return null;
        }
    }

    async findToken(refreshToken) {
        const token = await Token.findOne({ refreshToken });
        return token;
    }

    async removeToken(refreshToken) {
        const token = await Token.deleteOne({ refreshToken });
        return token.deletedCount;
    }
}

export default new TokenServices();
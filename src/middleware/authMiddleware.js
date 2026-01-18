import { ApiError } from "../exceptions/apiError.js";
import { User } from "../model/Users.js";
import tokenServices from "../services/TokenServices.js";

export const authMiddleware = async (req, res, next) => {

    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return next(ApiError.unauthorizeError());
        }
        const validateToken = tokenServices.validateAccessToken(accessToken);
        if (!validateToken) {
            return next(ApiError.unauthorizeError());
        }
        const user = await User.findOne({ _id: validateToken.id });
        if (!user) {
            return next(ApiError.unauthorizeError());
        }
        req.token = validateToken;
        req.user = user;
        next();
    } catch (e) {
        return next(ApiError.unauthorizeError());
    }
};
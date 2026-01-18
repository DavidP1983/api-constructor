import { ApiError } from "../exceptions/apiError.js";
import { User } from "../model/Users.js";
import tokenServices from "../services/TokenServices.js";

export const authMiddleware = async (req, res, next) => {

    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.unauthorizeError());
        }
        const validateToken = tokenServices.validateAccessToken(accessToken);
        if (!validateToken) {
            return next(ApiError.unauthorizeError());
        }
        const user = await User.findOne({ _id: validateToken.id });
        req.token = validateToken;
        req.user = user;
        next();
    } catch (e) {
        return next(ApiError.unauthorizeError());
    }
};
import { ApiError } from "../exceptions/apiError.js";

export function errorMiddleware(err, req, res, next) {
    console.log("Error ->", err);
    // Клиентские ошибки
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors, status: err.status });
    }

    // Ошибка сервера
    return res.status(500).json({ message: "Server error" });
};
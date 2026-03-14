import { connectDB } from "../config/db.js";

export const mongoMiddleware = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (e) {
        console.error("MongoDB connection error:", e);
        res.status(500).json({ message: "Database connection failed" });
    }
};
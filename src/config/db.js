import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

// Serverless connection for Vercel
const MONGODB_URI = process.env.DB_URL;
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 30000
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

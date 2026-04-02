import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

// Serverless connection for Vercel
const MONGODB_URL = process.env.DB_URL;
if (!MONGODB_URL) {
    throw new Error("Please define MONGO_URL");
}

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;


export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URL, {
            serverSelectionTimeoutMS: 30000,
            bufferCommands: true,
            maxPoolSize: 10,
            family: 4
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

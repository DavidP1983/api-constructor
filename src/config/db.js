import { connect } from 'mongoose';

let isConnected = false;

export async function connectDB() {
    if (isConnected) return;  // избегая повторного подключения
    try {
        await connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 30000
        });
        isConnected = true;
        console.log('mongoose Connected');
    } catch (e) {
        console.error('MongoDB connection error:', e);
        process.exit(1); // останавливаем север, если DB не подключен
    }
}



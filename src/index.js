import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { ApiError } from './exceptions/apiError.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { multerErrorHandler } from './middleware/multerErrorHandler.js';
import accessLinkRouter from './routers/accessLink.js';
import completedTestRouter from './routers/completed.js';
import testRouter from './routers/test.js';
import userRouter from './routers/user.js';

import { connect } from 'mongoose';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [
        process.env.CLIENT_URL_PROD,
        process.env.CLIENT_URL].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

app.use('/user', userRouter);
app.use('/test', testRouter);
app.use('/link', accessLinkRouter);
app.use('/completed', completedTestRouter);

app.use((req, res, next) => {
    next(ApiError.badRequest(404, `Request failed. Please try again`));
});

app.use(multerErrorHandler);
app.use(errorMiddleware);


let isConnected = false;

async function connectDB() {
    if (isConnected) return;  // избегая повторного подключения
    try {
        await connect(process.env.DB_URL, {
            serverSelectionTimeoutMS: 30000
        });
        app.listen(PORT, () => console.log(`Server listen on PORT ${PORT}`));
        isConnected = true;
        console.log('mongoose Connected');
    } catch (e) {
        console.error('MongoDB connection error:', e);
    }
}

await connectDB();
export default app;

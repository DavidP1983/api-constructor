import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import { ApiError } from '../exceptions/apiError.js';


const notificationSchema = new Schema({
    sender: { type: String, enum: ['System', 'Admin'], required: true },
    type: { type: String, enum: ['warning', 'system', 'info'], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: String, default: '' }
}, { _id: false });


const userSchema = new Schema({
    name: {
        type: String,
        uppercase: true,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: { type: String, required: true },
    role: { type: String, default: 'User' },
    joined: { type: String },
    notifications: { type: notificationSchema, default: null },
    lastLogin: { type: String, default: '' },
    lastActivity: { type: String },
    avatar: { type: Buffer },
    isOnline: { type: Boolean, default: false },
    feedbackSubmitted: { type: Boolean, default: false }
}, { timestamps: true });



userSchema.statics.registration = async (email) => {
    const user = await User.findOne({ email });

    if (user) {
        throw ApiError.badRequest(400, `Candidate with this email ${email} already exist`);
    }
    return true;
};

userSchema.statics.findCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw ApiError.badRequest(400, `User with this email ${email} does not exist`);
    }

    const isMath = await bcrypt.compare(password, user.password);

    if (!isMath) {
        throw ApiError.badRequest(400, 'Incorrect password');
    }
    return user;
};

userSchema.statics.checkCredentials = async (_id, password) => {
    const user = await User.findById({ _id });

    if (!user) {
        throw ApiError.badRequest(400, 'User not found');
    }
    const isMath = await bcrypt.compare(password, user.password);

    if (!isMath) {
        throw ApiError.badRequest(400, 'Wrong password');
    }
    return user;
};

userSchema.pre('save', async function () {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
});


export const User = model("User", userSchema);

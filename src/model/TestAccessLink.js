import { Schema, model } from 'mongoose';

const testAccessLinkSchema = new Schema({
    token: {
        type: String,
        require: true,
        unique: true,
        index: true
    },
    testId: { type: String, require: true },
    used: { type: Boolean, require: true },
    startedAt: { type: Date, default: null },
    usedAt: { type: Date, default: null }
}, { timestamps: true });

testAccessLinkSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

export const TestAccessLink = model('TestAccessLink', testAccessLinkSchema);

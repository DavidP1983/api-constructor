import { Schema, model } from 'mongoose';


const optionSchema = new Schema({
    id: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: Boolean, required: true }
}, { _id: false });

const questionSchema = new Schema({
    id: { type: String, required: true },
    type: {
        type: String,
        enum: ['radio', 'checkbox'],
        required: true
    },
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    options: { type: [optionSchema], required: true }
}, { _id: false });


const testSchema = new Schema({
    id: { type: String, require: true },
    authorId: {
        type: Schema.Types.ObjectId, // authorId пользователя
        ref: "User",
        required: true
    },
    name: { type: String, required: true },
    creator: { type: String, required: true },
    createdAt: { type: String, required: true },
    participantsCount: { type: Number, required: true },
    test: { type: [questionSchema], required: true },
}, { timestamps: true });


export const Tests = model('Test', testSchema);
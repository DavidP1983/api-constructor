import { Schema, model } from 'mongoose';


const optionSchema = new Schema({
    id: { type: String, require: true },
    question: { type: String, require: true },
    answer: { type: Boolean, require: true }
}, { _id: false });

const questionSchema = new Schema({
    id: { type: String, require: true },
    type: {
        type: String,
        enum: ['radio', 'checkbox'],
        require: true
    },
    title: { type: String, require: true },
    instructions: { type: String, require: true },
    options: { type: [optionSchema], required: true }
}, { _id: false });

const resultSchema = new Schema({
    totalQuestions: { type: Number, require: true },
    answers: { type: Number, require: true },
}, { _id: false });




const testSchema = new Schema({
    id: { type: String, require: true },
    authorId: {
        type: Schema.Types.ObjectId, // authorId пользователя
        ref: "User",
        require: true
    },
    name: { type: String, require: true },
    createdAt: { type: String, require: true },
    participantsCount: { type: Number, require: true },
    test: { type: [questionSchema], require: true },
    result: { type: resultSchema, require: true }
}, { timestamps: true });


export const Tests = model('Test', testSchema);
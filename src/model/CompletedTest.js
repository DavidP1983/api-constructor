import { Schema, model } from 'mongoose';


const questionSchema = new Schema({
    questionId: { type: String, required: true },
    selectedOptions: { type: [String], required: true }
}, { _id: false });




const CompletedTestSchema = new Schema({
    accessToken: { type: String, required: true },
    id: { type: String, required: true },
    authorId: { type: String, required: true },
    testName: { type: String, required: true },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    score: { type: Number, required: true },
    status: { type: String, enum: ['passed', 'failed'], required: true },
    answers: { type: [questionSchema], required: true },
    startedAt: { type: Date, default: null },
    finishedAt: { type: Date, default: null },
    completedAt: { type: String, required: true },
    duration: { type: Number, default: 0, required: true }
}, { timestamps: true });

export const CompletedTest = model('CompletedTest', CompletedTestSchema);

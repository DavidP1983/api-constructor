import { Schema, model } from 'mongoose';


const questionSchema = new Schema({
    questionId: { type: String, require: true },
    selectedOptions: { type: [String], required: true }
}, { _id: false });




const CompletedTestSchema = new Schema({
    accessToken: { type: String, require: true },
    id: { type: String, require: true },
    authorId: { type: String, require: true },
    testName: { type: String, require: true },
    candidateName: { type: String, require: true },
    candidateEmail: { type: String, require: true },
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    score: { type: Number, require: true },
    status: { type: String, enum: ['passed', 'failed'], require: true },
    answers: { type: [questionSchema], require: true },
    startedAt: { type: Date, default: null },
    finishedAt: { type: Date, default: null },
    completedAt: { type: String, require: true },
    duration: { type: Number, default: 0, require: true }
}, { timestamps: true });

export const CompletedTest = model('CompletedTest', CompletedTestSchema);

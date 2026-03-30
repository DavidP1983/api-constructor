import { Schema, model } from 'mongoose';


const cardsSchema = new Schema({
    tag: { type: String, trim: true, default: null },
    question: { type: String, trim: true },
    answer: { type: String, trim: true },
    example: { type: String, trim: true, default: null },
    type: { type: String, enum: ['code', 'text', 'formula'], default: null },
    status: { type: String, enum: ['known', 'repeat'], default: null },
    img: { type: String, default: null },
    difficulty: { type: Number, enum: [1, 2, 3, 4, 5] },
    lang: { type: String, enum: ['ru', 'en', 'fr'], default: null },
}, { timestamps: true });


const flashCardsSchema = new Schema({
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        set: (v) => v ? v.charAt(0).toUpperCase() + v.slice(1) : v,
        trim: true,
        required: true,
    },
    abb: {
        type: String,
        required: true,
        trim: true,
    },
    color: {
        type: String,
        required: true,
        trim: true,
    },
    description: { type: String, required: true, default: null },
    tag: { type: String, trim: true, default: null },
    cards: { type: [cardsSchema], default: [] },
}, { timestamps: true });


export const FlashCards = model('FlashCards', flashCardsSchema);



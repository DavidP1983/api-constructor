import { Schema, model } from 'mongoose';

const tokenSchema = new Schema({
    refreshToken: {
        type: String,
        require: true,
    },
    userId: {
        type: Schema.Types.ObjectId, // id пользователя
        ref: "User",
    },

});

export const Token = model('Token', tokenSchema);

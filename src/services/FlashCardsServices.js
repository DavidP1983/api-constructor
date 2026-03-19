import { ApiError } from "../exceptions/apiError.js";
import { FlashCards } from "../model/FlashCards.js";

class FlashCardsServices {

    async getFolders(authorId) {
        const folders = await FlashCards.find({ authorId }).lean();
        return folders;
    }


    async createFolder(flashData, authorId) {

        if (!flashData.title || !flashData.abb) {
            throw new ApiError.badRequest(400, 'badRequest');
        }
        const data = {
            ...flashData,
            authorId,
            cards: []
        };

        const flashCards = new FlashCards(data);
        await flashCards.save();
        return flashCards;
    }
}

export default new FlashCardsServices();


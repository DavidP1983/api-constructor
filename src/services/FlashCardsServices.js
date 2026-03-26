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

    async findFolder(_id) {
        const folder = await FlashCards.findById(_id).lean();
        if (!folder) {
            throw new ApiError.badRequest(404, 'Folder not found');
        }
        return folder;
    }

    async deleteFolder(_id) {
        const result = await FlashCards.deleteOne({ _id });
        return result.deletedCount;
    }

    async updateFolder(_id, data) {
        const { title, description } = data;
        const updateFolder = await FlashCards.findOneAndUpdate(
            { _id },
            { $set: { title, description } },
            { new: true, overwrite: false });

        if (!updateFolder) {
            throw new ApiError.notFound('Folder not found');
        }
        return updateFolder;
    }

    async createCard(_id, data) {
        const createCard = await FlashCards.findOneAndUpdate(
            { _id },
            {
                $push: { cards: data }
            },
            { new: true, overwrite: false });

        if (!createCard) {
            throw new ApiError.notFound('Folder not found');
        }
        return createCard;
    }

    async updateCard(folderId, cardId, data) {

        /* Чтобы не перезаписывать все поля карточки, перезаписываем только те, которые были изменены*/
        const updatedFields = {};

        if (data.question !== undefined) updatedFields['cards.$.question'] = data.question;
        if (data.answer !== undefined) updatedFields['cards.$.answer'] = data.answer;
        if (data.difficulty !== undefined) updatedFields['cards.$.difficulty'] = data.difficulty;
        if (data.type !== undefined) updatedFields['cards.$.type'] = data.type;
        if (data.example !== undefined) updatedFields['cards.$.example'] = data.example;
        if (data.img !== undefined) updatedFields['cards.$.img'] = data.img;

        const updatedCard = await FlashCards.findOneAndUpdate(
            { _id: folderId, 'cards._id': cardId },
            { $set: updatedFields },
            { new: true }
        );
        if (!updatedCard) {
            throw new ApiError.notFound('Folder or Card not found');
        }
        /*Чтобы не возвращать весь документ возвращаем именно обновленную карточку*/
        return updatedCard.cards.find(c => c._id.toString() === cardId);
    }

    async deleteCard(folderId, cardId) {
        const deletedCard = await FlashCards.findByIdAndUpdate(
            { _id: folderId, 'cards._id': cardId },
            {
                $pull: { cards: { _id: cardId } }
            },
            { new: true }
        );
        if (!deletedCard) {
            throw new ApiError.notFound('Folder or Card not found');
        }
        return true;
    }
}

export default new FlashCardsServices();


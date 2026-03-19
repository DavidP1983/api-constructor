import FlashCardsServices from "../services/FlashCardsServices.js";

class FlashCardsController {

    async getFolders(req, res, next) {
        try {
            const id = req.token?.id;

            if (!id) {
                throw new ApiError.unauthorizeError();
            }

            const folders = await FlashCardsServices.getFolders(id);
            res.status(200).json(folders);
        } catch (e) {
            next(e);
        }
    }

    async createFolder(req, res, next) {
        try {
            const data = req.body;
            const id = req.token.id;

            if (!id) {
                throw new ApiError.unauthorizeError();
            }

            const flashCards = await FlashCardsServices.createFolder(data, id);
            res.status(201).json(flashCards);
        } catch (e) {
            next(e);
        }
    }
}

export default new FlashCardsController();
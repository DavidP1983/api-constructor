import { ApiError } from "../exceptions/apiError.js";
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

    async getFolderById(req, res, next) {
        try {
            const id = req?.params.id;
            if (!id) {
                throw new ApiError.badRequest(400, 'Folder ID not defined');
            }
            const folderData = await FlashCardsServices.findFolder(id);
            res.status(200).json(folderData);
        } catch (e) {
            next(e);
        }
    }

    async deleteFolderById(req, res, next) {
        try {
            const id = req.params.id;
            if (!id) {
                throw new ApiError.badRequest(400, 'Folder ID not defined');
            }
            const result = await FlashCardsServices.deleteFolder(id);

            if (result === 0) {
                throw new ApiError.notFound(404, 'Folder not found');
            }

            res.status(200).json({ success: true });
        } catch (e) {
            next(e);
        }
    }

    async updateFolderById(req, res, next) {
        try {
            const id = req.params.id;
            const data = req.body;
            if (!id) {
                throw new ApiError.badRequest(400, 'Folder ID not defined');
            }
            const result = await FlashCardsServices.updateFolder(id, data);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async createCardById(req, res, next) {
        try {
            const id = req.params.id;
            const data = req.body;
            if (!id) {
                throw new ApiError.badRequest(400, 'Folder ID not defined');
            }
            const result = await FlashCardsServices.createCard(id, data);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateCardById(req, res, next) {
        try {
            const { folderId, cardId } = req.params;
            const data = req.body;
            if (!folderId || !cardId) {
                throw new ApiError.badRequest(400, 'Folder ID or CardID not defined');
            }
            const result = await FlashCardsServices.updateCard(folderId, cardId, data);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async deleteCardById(req, res, next) {
        try {
            const { folderId, cardId } = req.params;
            if (!folderId || !cardId) {
                throw new ApiError.badRequest(400, 'Folder ID or CardID not defined');
            }
            await FlashCardsServices.deleteCard(folderId, cardId);
            res.status(200).json({ success: true });
        } catch (e) {
            next(e);
        }
    }
}

export default new FlashCardsController();
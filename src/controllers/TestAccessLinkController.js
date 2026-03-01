
import TestAccessLinkServices from '../services/TestAccessLinkServices.js';

class TestAccessLinkController {

    async createLink(req, res, next) {
        try {
            const testId = req.params.id;
            const userId = req.user.id;
            const { url } = await TestAccessLinkServices.create(testId, userId);
            res.status(200).json({ url });
        } catch (e) {
            next(e);
        }
    }

    async getTest(req, res, next) {
        try {
            const token = req.params.id;
            const { test, linkId } = await TestAccessLinkServices.getTest(token);
            res.status(200).send({ test, linkId });
        } catch (e) {
            next(e);
        }
    }
}

export default new TestAccessLinkController();
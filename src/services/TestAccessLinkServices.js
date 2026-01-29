import crypto from 'crypto';
import dotenv from 'dotenv';
import { ApiError } from '../exceptions/apiError.js';
import { TestAccessLink } from "../model/TestAccessLink.js";
import { Tests } from '../model/Tests.js';
dotenv.config();


class TestAccessLinkServices {

    async create(testId) {
        const token = crypto.randomBytes(16).toString('hex');
        const accessLink = {
            token,
            testId,
            used: false,
            startedAt: null
        };
        const url = new TestAccessLink(accessLink);
        await url.save();

        const clientUrl =
            process.env.NODE_ENV === 'production'
                ? process.env.CLIENT_URL_PROD
                : process.env.CLIENT_URL;

        if (!clientUrl) {
            throw new Error('CLIENT_URL is not defined');
        }
        return {
            url: `${clientUrl}/pass/${token}`
        };
    }

    async getTest(token) {
        const link = await TestAccessLink.findOne({ token });
        if (!link || link.used) {
            throw ApiError.availability(410, "Link not available");
        }
        await TestAccessLink.findOneAndUpdate({ token, startedAt: null }, { startedAt: new Date() }, { new: true });
        const test = await Tests.findOne({ id: link.testId });
        return { test, linkId: link._id };
    }
}

export default new TestAccessLinkServices();
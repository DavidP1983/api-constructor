import { format } from 'date-fns';
import { invalidateCompletedTestCache } from '../cache/invalidateCompletedTestCache.js';
import { ApiError } from '../exceptions/apiError.js';
import { CompletedTest } from "../model/CompletedTest.js";
import { TestAccessLink } from "../model/TestAccessLink.js";
import { Tests } from '../model/Tests.js';



class CompletedTestServices {

    async createAnswer(data) {
        const { accessToken, id } = data;
        const link = await TestAccessLink.findOne({ _id: accessToken });
        if (!link || link.used) {
            throw ApiError.availability(410, "Link expired");
        }

        const completedAt = new Date();
        const duration = Math.floor((completedAt.getTime() - link.startedAt.getTime()) / 1000);
        const formatCompletedAt = format(new Date(completedAt), "yyyy-MM-dd");

        const updatedTest = await Tests.findOneAndUpdate({ id: link.testId }, { $inc: { participantsCount: 1 } }, { new: true });

        if (!updatedTest) {
            throw ApiError.internal(500, 'Test not found after update');
        }

        await CompletedTest.create({
            ...data,
            authorId: updatedTest.authorId,
            startedAt: link.startedAt,
            finishedAt: completedAt,
            completedAt: formatCompletedAt,
            duration
        });

        await TestAccessLink.updateOne({ token: link.token }, { used: true, usedAt: completedAt }, { new: true });
        // Redis invalidate data
        await invalidateCompletedTestCache(updatedTest.authorId, id);

        return true;
    }

    async getCompletedTest(id) {
        const completeTest = await CompletedTest.find({ authorId: id }).sort({ createdAt: -1 }).lean();
        return completeTest;
    }

    async getCompletedTestResult(_id) {

        const completedTest = await CompletedTest.findOne({ _id });
        if (!completedTest) {
            throw ApiError.notFound(404, "Not found");
        }

        const originTest = await Tests.findOne({ id: completedTest.id });

        if (!originTest) {
            throw ApiError.notFound(404, "Not found");
        }
        return { originTest, completedTest };
    }

    async deleteCompletedTest(id) {
        const res = await CompletedTest.findOneAndDelete({ _id: id }).lean();

        // Redis invalidate data
        await invalidateCompletedTestCache(res.authorId, res.id);
        return res;
    }
}

export default new CompletedTestServices();


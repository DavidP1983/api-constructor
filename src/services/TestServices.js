import { format } from 'date-fns';
import { Tests } from "../model/Tests.js";

class TestServices {

    async find(filter) {
        const tests = await Tests.find(filter).sort({ createdAt: -1 }).lean();
        return tests;
    }

    async findById(id) {
        const test = await Tests.findOne({ id }).lean();
        return test;
    }

    async create(testData, authorId) {
        const now = new Date();
        const createdAt = format(new Date(now), "yyyy-MM-dd");
        const data = {
            ...testData,
            authorId,
            createdAt
        };

        const test = new Tests(data);
        await test.save();
        return test;
    }

    async update(updatedTest) {
        const { test, id } = updatedTest;
        const updateTest = await Tests.findOneAndUpdate({ id }, { test }, { new: true, overwrite: false });
        return updateTest;
    }

    async delete(id, userId, role) {
        if (role === 'Admin') {
            const result = await Tests.findOneAndDelete({ id });
            return result;
        }
        const result = await Tests.deleteOne({ id, authorId: userId });
        return result;
    }

    async deleteAllUserTests(id) {
        const result = await Tests.deleteMany({ authorId: id });
        return result.deletedCount;
    }
}

export default new TestServices();
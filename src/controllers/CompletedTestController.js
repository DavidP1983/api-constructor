import { ApiError } from "../exceptions/apiError.js";
import CompletedTestServices from "../services/CompletedTestServices.js";

class CompletedTestController {

    async createCompletedTest(req, res, next) {
        try {
            const completedTests = await CompletedTestServices.createAnswer(req.body);
            if (!completedTests) {
                throw new ApiError.internal(500, 'Failed to create completed test');
            }
            res.status(200).json({ success: true });
        } catch (e) {
            next(e);
        }
    }

    async getCompletedTest(req, res, next) {
        const id = req.params.id;
        try {
            const tests = await CompletedTestServices.getCompletedTest(id);
            if (!tests.length) {
                return next(ApiError.notFound(404, "Not found"));
            }
            res.status(200).send(tests);
        } catch (e) {
            next(e);
        }
    }

    async getCompletedTestResult(req, res, next) {
        const id = req.params.id;
        try {
            const result = await CompletedTestServices.getCompletedTestResult(id);
            res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    async deleteCompletedTest(req, res, next) {
        const id = req.params.id;
        try {
            const test = await CompletedTestServices.deleteCompletedTest(id);
            if (!test) {
                throw ApiError.notFound(404, "Item Not found");
            }
            res.status(200).send({ message: `Completed test ${id} was deleted` });
        } catch (e) {
            next(e);
        }
    }
}

export default new CompletedTestController();
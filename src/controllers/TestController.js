
import { ApiError } from "../exceptions/apiError.js";
import testServices from "../services/TestServices.js";

class TestController {

    async getTestsByQueryParams(req, res, next) {
        try {
            const { q } = req?.query;
            const { id, role } = req.user;
            const filter = {};

            if (role !== "Admin") {
                filter.authorId = id;
            }

            if (q) {
                filter.name = { $regex: q, $options: "i" };
            }
            const tests = await testServices.find(filter);
            res.status(200).send(tests);

        } catch (e) {
            next(e);
        }
    }

    async createTest(req, res, next) {
        try {
            const createdTest = await testServices.create(req.body, req.token.id);
            res.status(201).send(createdTest);
        } catch (e) {
            next(e);
        }
    }

    async getPublicTests(req, res, next) {
        try {
            const tests = await testServices.find({});
            res.status(200).send(tests);
        } catch (e) {
            next(e);
        }
    }

    async getTestsByID(req, res, next) {
        const id = req.params.id;
        try {
            const tests = await testServices.findById(id);
            if (!tests) {
                return next(ApiError.notFound(404, "Not found"));
            }
            res.status(200).send(tests);
        } catch (e) {
            next(e);
        }
    }

    async updateTest(req, res, next) {
        try {
            const updatedTest = await testServices.update(req.body);
            return res.status(200).send(updatedTest);
        } catch (e) {
            next(e);
        }
    }

    async deleteTest(req, res, next) {
        const id = req.params.id;
        try {
            const test = await testServices.delete(id, req.user.id, req.user.role);
            if (!test) {
                return next(ApiError.notFound(404, "Item Not found"));
            }
            res.status(200).send({ message: `task ${id} was deleted, ${req.user.name}` });
        } catch (e) {
            next(e);
        }
    }
}

export default new TestController();
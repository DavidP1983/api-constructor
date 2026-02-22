import { redis } from '../lib/redis.js';
import { completedTestKey } from '../routers/completed.js';


export async function invalidateCompletedTestCache(authorId, testId) {
    try {
        await redis.del(completedTestKey.completedTest(authorId));
        await redis.del(completedTestKey.completedTestResult(testId));
    } catch (e) {
        console.error(e);
    }
}
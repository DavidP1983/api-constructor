import { redis } from '../lib/redis.js';
import { completedTestKey } from '../routers/completed.js';
import { invalidateTestsCache } from "./invalidateTestsCache.js";

export async function cleanupUserSession(id) {
    try {
        await redis.del(`refresh:${id}`);
        await redis.del(completedTestKey.completedTest(id));
        await invalidateTestsCache(id);
    } catch (e) {
        console.error(e);
    }
}
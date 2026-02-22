import { redis } from '../lib/redis.js';
import { fabricKey } from "../routers/test.js";

export async function invalidateTestsCache(id) {
    try {
        await redis.del(fabricKey.user(id));
        await redis.del(fabricKey.admin);
    } catch (e) {
        console.error(e);
    }
}
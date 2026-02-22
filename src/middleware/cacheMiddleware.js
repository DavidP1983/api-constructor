import { redis } from "../lib/redis.js";

export const cache = (keyGenerator, ttl = 60) => {

    return async (req, res, next) => {
        try {
            const { key, query = '' } = keyGenerator(req);

            if (query.trim() !== '') {
                return next();
            }

            console.log('KEY', key);
            const cached = await redis.get(key);
            console.log('CACHED', !!cached);
            if (cached) {
                console.log('CACHED DATA');
                return res.status(200).json(cached);
            }

            const originalJson = res.json.bind(res);
            res.json = (data) => {
                redis.set(key, data, { ex: ttl }).catch(console.error);
                console.log('CACHE SET');
                return originalJson(data);
            };
            next();
        } catch (e) {
            next(e);
        }
    };
};
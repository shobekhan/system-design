// userReadService.js

import { cache } from "./cacheClient.js";
import { getUserFromDB } from "./db.js";
import { getUserVersion } from "./versionService.js";

const TTL = 300;

export async function getUser(userId) {

    const version = await getUserVersion(userId);

    const cacheKey = `user:${userId}:v${version}`;

    const cached = await cache.get(cacheKey);

    if (cached) {
        console.log("CACHE HIT", cacheKey);
        return JSON.parse(cached);
    }

    console.log("CACHE MISS", cacheKey);

    const user = await getUserFromDB(userId);

    if (!user) return null;

    await cache.setEx(cacheKey, TTL, JSON.stringify(user));

    return user;
}